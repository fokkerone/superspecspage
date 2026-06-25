import { InfiniteBoxCarousel } from "@/components/ui/sidescroller";

export default function InputDemo() {
  return (
    <div className="bg-accent">
      <InfiniteBoxCarousel>
        <div className="bg-red-500 h-full rounded-2xl">Box 1</div>
        <div className="bg-blue-500 h-full rounded-2xl">Box 2</div>
        <div className="bg-green-500 h-full rounded-2xl">Box 3</div>
        <div className="bg-red-500 h-full rounded-2xl">Box 4</div>
        <div className="bg-blue-500 h-full rounded-2xl">Box 5</div>
        <div className="bg-green-500 h-full rounded-2xl">Box 6</div>
        <div className="bg-red-500 h-full rounded-2xl">Box 7</div>
        <div className="bg-blue-500 h-full rounded-2xl">Box 8</div>
        <div className="bg-green-500 h-full rounded-2xl">Box 9</div>
        <div className="bg-red-500 h-full rounded-2xl">Box 10</div>
        <div className="bg-blue-500 h-full rounded-2xl">Box 11</div>
        <div className="bg-green-500 h-full rounded-2xl">Box 13</div>
        <div className="bg-red-500 h-full rounded-2xl">Box 14</div>
        <div className="bg-blue-500 h-full rounded-2xl">Box 15</div>
        <div className="bg-green-500 h-full rounded-2xl">Box 16</div>
      </InfiniteBoxCarousel>
    </div>
  );
}
