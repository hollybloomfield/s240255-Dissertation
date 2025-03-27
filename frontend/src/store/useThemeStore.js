import {create} from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("Festie-theme") || "Festie", //gets theme from local storage
    //default is light mode
    setTheme: (theme) => {
        localStorage.setItem("Festie-theme", theme) //sets theme in local storage
        set({theme})
    },
}));