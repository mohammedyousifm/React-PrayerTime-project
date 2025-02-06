import { useEffect, useState } from "react";

const PrayerTimer = ({ city }) => {
  const [prayerTimes, setPrayerTimes] = useState({});
  const [nextPrayer, setNextPrayer] = useState("");
  const [timeLeft, setTimeLeft] = useState(""); // HH:MM:SS format
  const [dateTime, setDateTime] = useState(""); // Current date

  // Fetch prayer times from API
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=India&method=2`
        );
        const data = await response.json();

        setPrayerTimes(data.data.timings);
        setDateTime(data.data.date.gregorian.date);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
      }
    };

    fetchPrayerTimes();
  }, [city]);

  // Convert time "HH:mm" to Date object
  const parseTime = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hour, minute, 0, 0);
    return prayerDate;
  };

  // Find next prayer and update countdown
  const updatePrayerTime = () => {
    const currentTime = new Date();
    let nextPrayerTime = null;
    let nextPrayerName = "";

    for (const [prayer, time] of Object.entries(prayerTimes)) {
      const prayerDateTime = parseTime(time);

      // Find the first prayer time that is in the future
      if (prayerDateTime > currentTime) {
        nextPrayerTime = prayerDateTime;
        nextPrayerName = prayer;
        break;
      }
    }

    // If no upcoming prayers today, set next prayer as Fajr (next day)
    if (!nextPrayerTime) {
      nextPrayerTime = parseTime(prayerTimes["Fajr"]);
      nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
      nextPrayerName = "Fajr";
    }

    // Calculate time difference
    const diffInSeconds = Math.floor((nextPrayerTime - currentTime) / 1000);
    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    setNextPrayer(nextPrayerName);
    setTimeLeft(`${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
  };

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(updatePrayerTime, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  return (
    <div className="PrayerTimer">
      <h2>Upcoming Prayer</h2>
      <h4>{nextPrayer} in {timeLeft}</h4>
    </div>
  );
};

export default PrayerTimer;
