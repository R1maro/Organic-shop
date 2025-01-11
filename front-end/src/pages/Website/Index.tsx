
import Navbar from '../../components/Navbar/Navbar';
import Slider from '../../components/Hero/Slider';
import Advertisement   from "../../components/Hero/Advertisement.tsx";
import Card1 from '../../images/cards/cards-04.png';
import Card2 from '../../images/cards/cards-05.png';
import Card3 from '../../images/cards/cards-06.png';
import Card from "../../components/Section-One/Card.tsx";
import CategorySale from "../../components/Section-Two/Category-Sale.tsx"
import Footer from "../../components/Footer/Footer.tsx";


const slides = [
    Card1,
    Card2,
    Card3,
];
const rightImages = [
    { src: 'main../../images/product/mahsol.png', title: 'Product 1' },
    { src: 'https://via.placeholder.com/400x200', title: 'Product 2' },
];


const HomePage = () => {
    return (
        <div dir="rtl">
            <Navbar/>
            <main>
                <div className="flex flex-row-reverse w-5/5 mx-auto mt-4">
                    <Advertisement images={rightImages}/>
                    <Slider slides={slides}/>
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

export default HomePage;




