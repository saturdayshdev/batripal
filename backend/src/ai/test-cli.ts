#!/usr/bin/env node
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AiService } from './ai.service';
import * as readline from 'readline';

// Add color for better visibility
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Custom type for our patched functions
interface PatchedFunction extends Function {
  __patched?: boolean;
}

async function runCli() {
  console.log('🤖 Initializing AI Agent System...');
  
  // Initialize NestJS application
  const app = await NestFactory.createApplicationContext(AppModule);
  const aiService = app.get(AiService);
  
  console.log('✅ System initialized and ready');
  console.log('💬 Start chatting with the AI (type "exit" to quit)\n');
  console.log('📝 Special commands:');
  console.log('  - debug: Show all messages in the conversation\n');
  
  // User context (can be adapted as needed)
  const userContext = `
    User Profile:
    - 45-year-old female
    - 6 weeks post-gastric sleeve surgery
    - Current diet: pureed foods
    - Main concerns: protein intake, fatigue
  `;
  
  console.log(`${colors.blue}ℹ️ User context is being sent as a system message:${colors.reset}`);
  console.log(`${colors.yellow}${userContext}${colors.reset}\n`);
  
  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  // Process user input in a loop
  const processUserInput = () => {
    rl.question(`${colors.green}You: ${colors.reset}`, async (userInput) => {
      // Check for exit command
      if (userInput.toLowerCase() === 'exit') {
        console.log('\n👋 Goodbye!');
        rl.close();
        await app.close();
        return;
      }
      
      // Special debug command to examine thread messages
      if (userInput.toLowerCase() === 'debug') {
        await dumpThreadMessages(aiService);
        processUserInput();
        return;
      }
      
      try {
        console.log(`${colors.yellow}⏳ Processing...${colors.reset}`);
        const startTime = Date.now();
        
        // Add a logging hook to detect which agent is being used
        const originalProcessUserInput = aiService.processUserInput as PatchedFunction;
        
        // Monkey patch the method to add logging (just for our CLI)
        if (!originalProcessUserInput.__patched) {
          const originalMethod = aiService.processUserInput;
          (aiService.processUserInput as PatchedFunction) = async function(this: any, userInput: string, userContext?: string) {
            console.log(`${colors.cyan}🔍 Triage agent analyzing query...${colors.reset}`);
            
            try {
              // Monitor the private parseAgentResponse method to see the agent type
              const originalParseAgentResponse = this.parseAgentResponse as PatchedFunction;
              if (originalParseAgentResponse && !originalParseAgentResponse.__patched) {
                this.parseAgentResponse = async function(this: any, response: string) {
                  const result = await originalParseAgentResponse.call(this, response);
                  console.log(`${colors.magenta}🧠 Triage decision: Routing to ${result.agent} agent${colors.reset}`);
                  return result;
                };
                (this.parseAgentResponse as PatchedFunction).__patched = true;
              }
              
              // Monitor the processWithSpecialist method
              const originalProcessWithSpecialist = this.processWithSpecialist as PatchedFunction;
              if (originalProcessWithSpecialist && !originalProcessWithSpecialist.__patched) {
                this.processWithSpecialist = async function(this: any, specialistType: any, userMessage: string) {
                  console.log(`${colors.blue}👩‍⚕️ ${specialistType} specialist processing request...${colors.reset}`);
                  const result = await originalProcessWithSpecialist.call(this, specialistType, userMessage);
                  return result;
                };
                (this.processWithSpecialist as PatchedFunction).__patched = true;
              }
              
              const result = await originalMethod.call(this, userInput, userContext);
              return result;
            } catch (error) {
              console.error(`${colors.red}Error in patched method: ${error.message}${colors.reset}`);
              return await originalMethod.call(this, userInput, userContext);
            }
          };
          (aiService.processUserInput as PatchedFunction).__patched = true;
        }
        
        // Process the user input, passing the user context
        const response = await aiService.processUserInput(userInput, userContext);
        const duration = (Date.now() - startTime) / 1000;
        
        // Display the response
        console.log(`\n${colors.cyan}Assistant (${duration.toFixed(2)}s):${colors.reset}`);
        console.log(response.content);
        
        if (response.audioBuffer) {
          console.log(`${colors.yellow}🔊 (Audio response generated)${colors.reset}`);
        }
        
        console.log(); // Add a blank line for readability
        
        // Continue the conversation
        processUserInput();
      } catch (error) {
        console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
        processUserInput();
      }
    });
  };
  
  // Start the conversation
  processUserInput();
}

// Helper function to inspect thread messages
async function dumpThreadMessages(aiService: any) {
  try {
    if (!aiService.conversationThread) {
      console.log(`${colors.yellow}⚠️ No conversation thread available yet${colors.reset}`);
      return;
    }
    
    console.log(`\n${colors.magenta}🔍 THREAD MESSAGES ANALYSIS:${colors.reset}`);
    console.log(`${colors.blue}============================${colors.reset}`);
    
    // Get a reference to the thread
    const messages = await aiService.aiSdk.getMessages(aiService.conversationThread.id);
    
    if (!messages || !messages.data || messages.data.length === 0) {
      console.log(`${colors.yellow}No messages in thread yet${colors.reset}`);
      return;
    }
    
    // Display messages
    messages.data.forEach((msg: any, i: number) => {
      const roleType = msg.metadata?.type === 'system' ? 'SYSTEM' : msg.role.toUpperCase();
      const metadata = msg.metadata ? `[Metadata: ${JSON.stringify(msg.metadata)}]` : '';
      const contentType = msg.content[0]?.type || 'unknown';
      const content = msg.content[0]?.type === 'text' ? msg.content[0].text.value : 'Non-text content';
      
      console.log(`${colors.cyan}Message ${i+1} (${roleType}) ${metadata}:${colors.reset}`);
      console.log(`${colors.yellow}${content.substring(0, 200)}${content.length > 200 ? '...' : ''}${colors.reset}`);
      console.log(`${colors.blue}----------------------------${colors.reset}`);
    });
    
    console.log(`${colors.blue}============================${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}❌ Error dumping messages: ${error.message}${colors.reset}`);
  }
}

// Run the CLI
runCli().catch(error => {
  console.error('\x1b[31m❌ Fatal error:', error, '\x1b[0m');
  process.exit(1);
}); 