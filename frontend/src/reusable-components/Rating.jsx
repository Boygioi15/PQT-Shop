import iconStar from "../assets/iconStar.png";

const Rating = ({ rating = 4 }) => {
  return (
    <div className="flex items-center">
      {/* Vòng lặp sao */}
      {[...Array(5)].map((_, index) => (
        <img
          key={index}
          src={iconStar}
          alt={`star-${index}`}
          className={`h-4 w-4 ${
            index < rating ? "fill-yellow-300" : "fill-gray-300"
          }`}
        />
      ))}
      <span className="px-2 py-1 text-base font-thin text-[#666666]">
        ({rating}/5)
      </span>
      <span className="mx-1 px-2 py-1 text-base font-thin text-[#666666]">
        4 reviews
      </span>
    </div>
  );
};

export default Rating;
