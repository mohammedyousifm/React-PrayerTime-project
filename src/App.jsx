import { useEffect, useState } from "react";
import "./App.css";
import "./components/header.css";
import Prayer from "./components/Prayer";
import  CitySelector  from "./components/CitySelector";
import PrayerTimer from "./utils/upcoming"
import { useTranslation } from "react-i18next";

function App() {

  const { t, i18n } = useTranslation();

  // Handle language change
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  // Change body class for RTL languages
  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  // State for storing prayer times
  const [prayerTimes, setPrayerTimes] = useState(null);
  // State for date Time prayer times
  const [dateTime, setDateTime] = useState("");
  // State for city prayer times
  const [city, setCity] = useState("");

  // State for loading
  const [loading, setLoading] = useState(true);

    // State for loading
    const [loadingDate, setLoadingDate] = useState(true);

  // State  Change the Light mood
  const [theme , setTheme] = useState(localStorage.getItem("currentMoodLight") || "light");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const savedLanguage = localStorage.getItem("language") || "en";



  const cities = [
    { name: "Delhi", value: "Delhi" },
    { name: "Mumbai", value: "Mumbai" },
    { name: "Kolkata", value: "Kolkata" },
    { name: "Bangalore", value: "Bangalore" },
    { name: "Jalandhar", value: "Jalandhar" },
  ];

  useEffect(() => {

    if (theme === "light")
    {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    }

  } , [theme]);

  // Fetch User Country
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch country details
        const countryResponse = await fetch("https://ipinfo.io?token=cec6aac2d6bcea");
        const countryData = await countryResponse.json();
        const countryCode = countryData.country.toLowerCase();
        document.getElementById("country-name").textContent = countryData.country;
        document.getElementById("country-flag").src = `https://flagcdn.com/w40/${countryCode}.png`;

        // Fetch prayer times if city is selected
        if (city) {
          const prayerResponse = await fetch(
            `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=India&method=2`
          );
          const prayerData = await prayerResponse.json();
          setPrayerTimes(prayerData.data.timings);
          setDateTime(prayerData.data.date.gregorian.date);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDetails();
  }, [city]);

  // Fetch Prayer Times
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=India&method=2`
        );
        const date_Prayer = await response.json();

        setPrayerTimes(date_Prayer.data.timings);
        setDateTime(date_Prayer.data.date.gregorian.date);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPrayerTimes();
  }, [city]);

  // Format Time
  const formatTime = (time) => {
    if (!time) {
      return "00:00";
    }

    let [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? t("PM") : t("AM");
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${period}`;
  };

 //loading Prayer Time
  useEffect(() => {
    // Whenever the city is changed or when the component mounts, trigger loading
    setLoading(true);

    const timeout = setTimeout(() => {
        setLoading(false);
    }, 2000);

    // Cleanup timeout in case the city changes or component unmounts
       return () => clearTimeout(timeout);
   }, [city]);

    useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
   setLoadingDate(true);

   const timeout = setTimeout(() => {
     setLoadingDate(false);
   }, 2000);

   return () => clearTimeout(timeout);
 }, []); // Empty dependency array means it runs only on mount

 useEffect(() => {
   setLoading(true);
 }, []);


  return (
   <>
      <header className="header">
           <nav className="nav">
              <ul className="nav-list">

                <li className="country-item">
                  <div className="country-info">
                    <img
                      id="country-flag"
                      className="flag-icon"
                      src="https://flagcdn.com/w40/in.png"
                      alt="Country Flag"
                    />
                    <span id="country-name" className="country-name">India</span>
                  </div>
                </li>

                <li className="language-item">
               <div className="language-switcher">
                 <button
                   className="language-toggle-btn"
                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                 >
                   <img
                     src={
                       savedLanguage === "ar"
                         ? "https://flagcdn.com/w40/sa.png"
                         : "https://flagcdn.com/w40/us.png"
                     }
                     alt="Language"
                     className="flag-icon"
                   />
                   <span className="language-name">
                     {savedLanguage === "ar" ? "العربية" : "English"}
                   </span>
                   <i className={`arrow-icon ${isDropdownOpen ? "open" : ""}`} />
                 </button>

                 {isDropdownOpen && (
                   <div className="language-options-dropdown">
                     <div
                       className="language-option"
                       onClick={() => {
                        changeLanguage("en");
                         setIsDropdownOpen(false);
                         localStorage.setItem("language" , "en")
                       }}
                     >
                       <img
                         src="https://flagcdn.com/w40/us.png"
                         alt="English"
                         className="flag-icon"
                       />
                       <span className="language-name">English</span>
                     </div>
                     <div
                       className="language-option"
                       onClick={() => {
                        changeLanguage("ar");
                         setIsDropdownOpen(false);
                         localStorage.setItem("language" , "ar")
                       }}
                     >
                       <img
                         src="https://flagcdn.com/w40/sa.png"
                         alt="Arabic"
                         className="flag-icon"
                       />
                       <span className="language-name">العربية</span>
                     </div>
                   </div>
                 )}
               </div>
             </li>


                <button
                 onClick={() => {
                   // Toggle theme on click and save to localStorage
                   const newTheme = theme === "dark" ? "light" : "dark";
                   localStorage.setItem("currentMoodLight", newTheme); // Store in localStorage
                   setTheme(newTheme); // Update state
                 }}
                 className={theme === "dark" ? "dark" : "light"}
               >
                 {theme === "dark" ? (
                   <i className="fa-solid fa-moon"></i>
                 ) : (
                   <i className="fa-solid fa-sun"></i>
                 )}
               </button>

              </ul>
           </nav>
      </header>

      <section className="main-section">


        <div className="container">
           <div className="top_sec">
             <CitySelector cities={cities} setCity={setCity} />

             <PrayerTimer city={city}/>

             <div className="date">
               <h2>{t("date")}</h2>
               <h4>
                  {loadingDate ? (
                    <>
                      {t("Loading")}
                    </>
                ): (
                  <>
                     {dateTime}
                  </>
                )}
               </h4>
             </div>

           </div>

             {loading ? (
                <>
                   <Prayer name={t("Fajr")} time={t("Loading")} />
                   <Prayer name={t("Dhuhr")} time={t("Loading")} />
                   <Prayer name={t("Asr")} time={t("Loading")} />
                   <Prayer name={t("Maghrib")} time={t("Loading")} />
                   <Prayer name={t("Isha")} time={t("Loading")} />
               </>
                ) : (
                <>
                    <Prayer name={t("Fajr")} time={formatTime(prayerTimes.Fajr)} />
                    <Prayer name={t("Dhuhr")} time={formatTime(prayerTimes.Dhuhr)} />
                    <Prayer name={t("Asr")} time={formatTime(prayerTimes.Asr)} />
                    <Prayer name={t("Maghrib")} time={formatTime(prayerTimes.Maghrib)} />
                    <Prayer name={t("Isha")} time={formatTime(prayerTimes.Isha)} />
                </>
            )}
         </div>


      </section>
    </>
  );
}

export default App;
