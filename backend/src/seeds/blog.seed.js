import {config} from "dotenv";
import {connectDB} from "../lib/db.js";
import Blog from "../models/blog.model.js";

config()

const seedBlogs = [
    {
        title: "Top Festival Safety Tips",
        image: "https://images.unsplash.com/photo-1520095972714-909e91b038e5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        content:  `
        <p>Festivals are exciting events, but it's important to stay safe while having fun. Here are some tips:</p>
        <ul>
          <li>Stay in groups whenever possible.</li>
          <li>Keep your phone charged and in a safe place.</li>
          <li>Know the location of medical and emergency services.</li>
          <li>Be mindful of your drink and food.</li>
        </ul>
        <p>Have fun, but always prioritize your safety!</p>
      `,
        author: "Emma Thompson"
    },
    {
        title: "Festival Packing Guide",
        image: "https://images.pexels.com/photos/9186037/pexels-photo-9186037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Unsplash image URL
        content: `
          <p>Festivals can last several days, so it's essential to pack wisely. Here's a checklist to help you out:</p>
          <ul>
            <li>Comfortable shoes and clothes.</li>
            <li>Portable charger.</li>
            <li>Waterproof jacket (just in case!).</li>
            <li>Festival tickets and ID.</li>
            <li>Personal hygiene items (toothbrush, sunscreen, etc.).</li>
          </ul>
          <p>Don't forget to pack a good attitude and positive vibes!</p>
        `,
        author: "Olivia Miller",
    },
    {
        title: "How to Meet New People at Festivals: Tips for Making Friends",
        image: "https://images.unsplash.com/photo-1522543558187-768b6df7c25c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Unsplash image URL
        content: `
          <p>Festivals are a great place to meet new people. Here's how you can break the ice and build lasting connections:</p>
          <ul>
            <li>Join group activities and be open to chatting with strangers.</li>
            <li>Share your festival experiences with others.</li>
            <li>Don't be afraid to start a conversation about the music, food, or vibe.</li>
            <li>Find others who are attending the same festival as you on here beforehand.</li>
          </ul>
          <p>Festivals are all about having fun and creating new memories with others!</p>
        `,
        author: "Ava Wilson",
      },
      {
        title: "Top Tips for Surviving Festival Crowds",
        image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Unsplash image URL
        content: `
          <p>Festivals can get crowded, and it's normal to feel overwhelmed. Here are some tips to stay calm:</p>
          <ul>
            <li>Find quiet spaces to relax and recharge.</li>
            <li>Stay hydrated and take breaks when needed.</li>
            <li>Practice mindfulness and deep breathing exercises.</li>
          </ul>
          <p>Stay in the moment and enjoy the festival without feeling anxious!</p>
        `,
        author: "Isabella Brown",
      },
];

const seedDatabase = async () => {
    try{
        await connectDB()

        await Blog.insertMany(seedBlogs)
        console.log("Database seeded successfully")
    } catch (error) {
        console.error("Error seeding database:", error)
    }
}

seedDatabase()