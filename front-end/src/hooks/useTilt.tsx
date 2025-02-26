import {  useRef, useEffect } from 'react';
function useTilt(animationDuration = '150ms') {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        // Used to unify the touch and click cases
        const unify = (e: MouseEvent | TouchEvent) => {
            return 'changedTouches' in e ? e.changedTouches[0] : e as MouseEvent;
        };

        const state = {
            rect: undefined as DOMRect | undefined,
            mouseX: undefined as number | undefined,
            mouseY: undefined as number | undefined,
        };

        let el = ref.current;

        const handleEnterEvent = () => {
            el.style.transition = `transform ${animationDuration} ease-out`;
        };

        const handleMoveEvent = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();

            if (!el) {
                return;
            }
            if (!state.rect) {
                state.rect = el.getBoundingClientRect();
            }

            const unifiedE = unify(e);
            state.mouseX = unifiedE.clientX;
            state.mouseY = unifiedE.clientY;

            const px = (state.mouseX - state.rect.left) / state.rect.width;
            const py = (state.mouseY - state.rect.top) / state.rect.height;

            el.style.setProperty('--px', px.toFixed(2));
            el.style.setProperty('--py', py.toFixed(2));
        };

        const handleEndEvent = () => {
            el.style.setProperty('--px', '0.5');
            el.style.setProperty('--py', '0.5');
            el.style.transition = `transform ${animationDuration} ease-in`;
        };

        el.addEventListener('mouseenter', handleEnterEvent);
        el.addEventListener('mousemove', handleMoveEvent as EventListener);
        el.addEventListener('mouseleave', handleEndEvent);
        el.addEventListener('touchstart', handleEnterEvent);
        el.addEventListener('touchmove', handleMoveEvent as EventListener);
        el.addEventListener('touchend', handleEndEvent);

        return () => {
            el.removeEventListener('mouseenter', handleEnterEvent);
            el.removeEventListener('mousemove', handleMoveEvent as EventListener);
            el.removeEventListener('mouseleave', handleEndEvent);
            el.removeEventListener('touchstart', handleEnterEvent);
            el.removeEventListener('touchmove', handleMoveEvent as EventListener);
            el.removeEventListener('touchend', handleEndEvent);
        };
    }, [animationDuration]);

    return ref;
}

export default useTilt;