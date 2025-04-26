import Image from "next/image";

export default function MealHeader() {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200">
          <Image
            src="/logo.png"
            alt="Dr. Alex"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-0">Your Meal Plan</h2>
          <p className="text-sm text-gray-600">Recommended by Dr. Alex</p>
        </div>
      </div>
    </div>
  );
}
