// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import image1 from '/src/assets/image1.jpg';
import image2 from '/src/assets/image2.jpg';
import image3 from '/src/assets/image3.jpg';
import image4 from '/src/assets/image4.jpg';
import "../styles/home.css"; 

const Home = () => {
  const text = "Welcome!";
  const subText = "To the Houston Museum of Fine Arts";
  const [displayedText, setDisplayedText] = useState("");
  const [displayedSubText, setDisplayedSubText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const fullText = text + " " + subText;
    let tempText = "";

    const interval = setInterval(() => {
      if (i < fullText.length) {
        tempText += fullText[i];

        if (i < text.length) {
          setDisplayedText(tempText);
        } else {
          setDisplayedSubText(tempText.slice(text.length + 1));
        }
      } else {
        clearInterval(interval);
      }
      i++;
    }, 100);

    return () => clearInterval(interval);
  }, []);

 
const images = [image1, image2, image3, image4];
const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="page-container">
      <div className="content">
        <div
          className="homepage"
          style={{ 
            backgroundImage: `url(${images[currentImage]})`,
          }}
        >
          <div className="overlay"></div>

          <motion.div
            className="text-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="home-title">{displayedText}</h1>
            <p className="home-text">{displayedSubText}</p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
