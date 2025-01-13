import React from 'react';
interface RightImagesProps {
    images: { src: string; title: string }[];
}
const Advertisement: React.FC<RightImagesProps> = ({images}) => {
    return (
        <div className="flex flex-col justify-between w-100 h-120">
            {images.map((image, index) => (
                <div key={index} className="mb-1 w-full rounded overflow-hidden shadow-md">
                    <a href="">
                        <img src={image.src} alt={image.title} className="w-full h-full object-cover"/>
                    </a>
                    <h3 className="text-center font-bold text-lg mt-2">{image.title}</h3>
                </div>
            ))}
        </div>
    );
};

export default Advertisement;
