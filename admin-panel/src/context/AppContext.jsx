import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props)=>{

  const currencySymbol = "/-"

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    
    const today = new Date();
    const birthDate = new Date(dob);

    // Check if birthDate is valid
    if (isNaN(birthDate.getTime())) return "N/A";

    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Adjust age if birthday hasn't occurred this year
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 0 ? age.toString() : "N/A";
  }


  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    if (!slotDate) {
      return "Invalid Date";
    }
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };
    const value={
         calculateAge,
         slotDateFormat,
         currencySymbol
    }

    return(
      <AppContext.Provider value={value}>
         {props.children}
      </AppContext.Provider>
    )
}

export default AppContextProvider;