import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AiService } from './ai.service';

async function testAgents() {
  // Initialize NestJS application
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    // Get AI service from the application
    const aiService = app.get(AiService);
    
    console.log('✅ AI Service initialized');
    
    // Example user context (optional)
    const userContext = `
      User Profile:
      - 45-year-old female
      - 6 weeks post-gastric sleeve surgery
      - Current diet: pureed foods
      - Main concerns: protein intake, fatigue
    `;
    
    // Test queries for different specialists
    const testQueries = [
      {
        type: 'Triage',
        query: 'What should I expect during the recovery timeline?'
      },
      {
        type: 'Dietetic',
        query: "I'm struggling to get enough protein in my diet. What are some easy protein options that I can tolerate at 6 weeks post-op?"
      },
      {
        type: 'Psychotherapy',
        query: "I'm feeling frustrated because I can't enjoy my favorite foods anymore. How do I deal with this loss?"
      }
    ];
    
    // Process each test query
    for (const test of testQueries) {
      console.log(`\n🔄 Testing ${test.type} Query: "${test.query}"`);
      console.log('⏳ Processing...');
      
      const startTime = Date.now();
      const response = await aiService.processUserInput(test.query, userContext);
      const duration = (Date.now() - startTime) / 1000;
      
      console.log(`✅ Response (${duration.toFixed(2)}s):`);
      console.log('-------------------------------');
      console.log(response.content);
      console.log('-------------------------------');
      console.log(`Audio response: ${response.audioBuffer ? 'Generated' : 'Not generated'}`);
      
      // Add a pause between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n✅ All tests completed successfully');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Clean up and close the application
    await app.close();
  }
}

// Run the test
testAgents().catch(console.error); 