import Navbar from '../../components/Navbar/Navbar';
import Slider from '../../components/Hero/Slider';
import Advertisement from "../../components/Hero/Advertisement.tsx";
import Card from "../../components/Section-One/Card.tsx";
import CategorySale from "../../components/Section-Two/Category-Sale.tsx"
import Footer from "../../components/Footer/Footer.tsx";
import {useSettings} from '../../services/website/useSettings';


const Index = () => {
    const {settings, loading, error, getValue} = useSettings();

    const leftImages = Object.keys(settings)
        .filter((key) => key.startsWith('advertisement_image_'))
        .map((key) => ({
            src: getValue(key), // Get the media URL
            title: settings[key]?.label || 'Advertisement', // Use the label or fallback title
        }))
        .slice(0, 2);

    return (
        <div dir="rtl">
            <Navbar/>
            <main>
                <div className="flex flex-row-reverse w-5/5 mx-auto mt-4">
                    {loading && <p>Loading advertisements...</p>}
                    {error && <p>{error}</p>}
                    {!loading && !error && <Advertisement images={leftImages}/>}
                    <Slider/>
                </div>
                <div>
                    <Card/>
                </div>

                <div>
                    <CategorySale/>
                </div>

                <div dir="rtl">
                    <Footer/>
                </div>
            </main>
        </div>
    );
};

export default Index;




