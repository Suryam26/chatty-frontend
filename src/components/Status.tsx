import { useState, useEffect } from "react";

export function Status({ status }: any) {
  const [displayStatus, setDisplayStatus] = useState(false);

  useEffect(() => {
    setDisplayStatus(true);
    const timeout = setTimeout(() => {
      setDisplayStatus(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  function formatDate(dateString: string) {
    const dateParts: string[] = dateString.split(", ")[0].split("/");
    const day = dateParts[0];
    const month: string = getMonthName(Number(dateParts[1]));
    const year = dateParts[2];
    const formattedDate = day + " " + month + " " + year;
    return formattedDate;
  }

  function getMonthName(monthNumber: number) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber - 1];
  }

  function formatLastSeenDateTime(lastActiveDateTimeStr: string) {
    var currentDate = new Date();
    var lastActiveDateTime = new Date(lastActiveDateTimeStr);

    var timeDifferenceMs = currentDate.getTime() - lastActiveDateTime.getTime();
    var timeDifferenceMinutes = Math.floor(timeDifferenceMs / (1000 * 60));
    var timeDifferenceHours = Math.floor(timeDifferenceMinutes / 60);
    var timeDifferenceDays = Math.floor(timeDifferenceHours / 24);

    var timeAgo;
    if (timeDifferenceMinutes < 1) {
      timeAgo = "Just now";
    } else if (timeDifferenceMinutes < 60) {
      timeAgo = timeDifferenceMinutes + " minutes ago";
    } else if (timeDifferenceHours < 24) {
      timeAgo = timeDifferenceHours + " hours ago";
    } else if (timeDifferenceDays < 1) {
      timeAgo = "yesterday";
    } else {
      timeAgo = formatDate(lastActiveDateTime.toLocaleString());
    }

    return timeAgo;
  }
  return (
    <>
      {displayStatus && `last seen ${formatLastSeenDateTime(status.last_seen)}`}
    </>
  );
}
