/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gluten: ["Gluten", "sans-serif"]
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
      animation: {
        'gradient': 'gradient-shift 15s ease infinite',
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        Festie: {
          
        
          "primary": "#b72b63",
          
          "secondary": "#f4a8c7",
                    
          "accent": "#f8c291",
                    
          "neutral": "#ffdbe0",
                    
          "base-100": "#fefefa",
                    
          "info": "#67e8f9",
                    
          "success": "#86efac",
                    
          "warning": "#fcd34d",
                    
          "error": "#f43f5e",
          },
        },
        {
        FestieDark: {
          "primary": "#b72b63",    
          "secondary": "#f4a8c7",  
          "accent": "#f8c291",  
          "neutral": "#ffdbe0",   
          "base-100": "#1a1a1a",   
          "info": "#67e8f9", 
          "success": "#86efac",   
          "warning": "#fcd34d", 
          "error": "#f43f5e",  
        },
      },
      ],
    },
}