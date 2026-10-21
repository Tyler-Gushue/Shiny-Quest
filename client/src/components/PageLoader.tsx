import { useEffect, useState } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import starBg from '../assets/StarBackground.svg';
import ShinyQuestLogo from '../assets/ShinyQuestLogo.svg';

// Don't trap people on the spinner forever if an image or font is slow to arrive
const ASSET_TIMEOUT_MS = 8000;
const FADE_MS = 300;

function preloadImage(src: string) {
    return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
    });
}

function waitForWindowLoad() {
    return new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', () => resolve(), { once: true });
    });
}

// Fonts only download once something asks for them, so request the ones index.html links
function loadFonts() {
    const fonts = ['400 1em Poppins', '600 1em Poppins', '700 1em Poppins', '400 1em Sniglet', '800 1em Sniglet'];
    return Promise.all(fonts.map((font) => document.fonts.load(font))).catch(() => {});
}

// Full-screen spinner over the whole app until the first page is fully ready:
// images, fonts, the session check, and any data the page fetches on mount
function PageLoader() {

    const { isLoading: authLoading } = useAuth();
    const fetchingCount = useIsFetching();

    const [assetsLoaded, setAssetsLoaded] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {

        const assets = Promise.all([
            waitForWindowLoad(),
            loadFonts(),
            preloadImage(starBg),
            preloadImage(ShinyQuestLogo),
        ]);
        const timeout = new Promise((resolve) => setTimeout(resolve, ASSET_TIMEOUT_MS));

        Promise.race([assets, timeout]).then(() => setAssetsLoaded(true));

    }, []);

    const isReady = assetsLoaded && !authLoading && fetchingCount === 0;

    // Once ready, fade out and stay gone so later refetches don't bring the spinner back
    if (isReady && !isFading) setIsFading(true);

    useEffect(() => {

        if (!isFading) return;

        const timer = setTimeout(() => setIsDone(true), FADE_MS);
        return () => clearTimeout(timer);

    }, [isFading]);

    if (isDone) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-950 transition-opacity duration-300 ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            <LoadingSpinner />
        </div>
    )

}

export default PageLoader;
