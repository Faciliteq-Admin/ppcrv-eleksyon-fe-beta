import React from "react";

interface CardProps {
    title?: string;
    description?: string;
    imageUrl?: string; // Optional prop
    children?: React.ReactNode; // To allow nesting components
    bgColor?: string;
    style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, children, bgColor='bg-white', style }) => {
  return (
    //max-w-sm rounded overflow-hidden shadow-lg
    <div className={`rounded overflow-hidden shadow-lg ${bgColor}`} style={style}>
      {imageUrl && (
        <img
          className="w-full"
          src={imageUrl}
          alt={title}
        />
      )}
      <div className="px-6 py-4">
        {title && 
            <h2 className="font-bold text-xl mb-2 text-gray-800">{title}</h2>
        }
        {description && 
            <p className="text-gray-700 text-base">{description}</p>
        }
      </div>
      {children}
    </div>
  );
};

export default Card;