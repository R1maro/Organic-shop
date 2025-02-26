
import React  from 'react';
import {SlideProps} from "@/types/carousel";
import useTilt from "@/hooks/useTilt"

const Slide: React.FC<SlideProps> = ({
                                         image,
                                         title,
                                         subtitle,
                                         description,
                                         offset,
                                         isPageBackground
                                     }) => {
    const active = offset === 0 ? true : null;
    const ref = useTilt(active ? '150ms' : undefined);

    return (
        <div
            ref={ref}
            className="slide"
            data-active={active}
            style={{
                '--offset': offset,
                '--dir': offset === 0 ? 0 : offset > 0 ? 1 : -1,
            } as React.CSSProperties}
        >
            {isPageBackground && (
                <div
                    className="slideBackground"
                    style={{
                        backgroundImage: `url('${image}')`,
                        height: '650px',
                    }}
                />
            )}
            <div
                className="slideContent"
                style={{
                    backgroundImage: `url('${image}')`,
                }}
            >
                <div className="slideContentInner">
                    {title && (
                        <h2 className="slideTitle" dir="auto">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <h3 className="slideSubtitle" dir="auto">
                            {subtitle}
                        </h3>
                    )}
                    {description && (
                        <p className="slideDescription" dir="auto">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Slide;
