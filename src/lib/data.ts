export const STYLES=["Realistic","Cinematic","Anime","3D Animation","Cartoon","Sketch","Cyberpunk","Watercolor"];
export const VOICES=[
 {name:"Ayesha (Urdu Female)",lang:"Urdu",gender:"Female"},{name:"Bilal (Urdu Male)",lang:"Urdu",gender:"Male"},
 {name:"Priya (Hindi Female)",lang:"Hindi",gender:"Female"},{name:"Arjun (Hindi Male)",lang:"Hindi",gender:"Male"},
 {name:"Sarah (English US)",lang:"English",gender:"Female"},{name:"James (English UK)",lang:"English",gender:"Male"},
 {name:"Fatima (Arabic Female)",lang:"Arabic",gender:"Female"},{name:"Carlos (Spanish)",lang:"Spanish",gender:"Male"},
 {name:"Kid Voice (English)",lang:"English",gender:"Kids"},{name:"Narrator Pro",lang:"English",gender:"Male"},
];
export const AVATARS=[
 {name:"Ayesha",role:"Urdu Presenter • Female",img:"https://images.pexels.com/photos/6543909/pexels-photo-6543909.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"},
 {name:"Ahmed",role:"Business • Male",img:"https://images.pexels.com/photos/7301578/pexels-photo-7301578.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"},
 {name:"Zara",role:"Fashion Creator • Female",img:"https://images.pexels.com/photos/7516560/pexels-photo-7516560.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"},
 {name:"Kenji",role:"Anime Host • Male",img:"https://images.pexels.com/photos/9363479/pexels-photo-9363479.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"},
 {name:"Maria",role:"News Anchor • Female",img:"https://images.pexels.com/photos/11124888/pexels-photo-11124888.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"},
 {name:"David",role:"Teacher • Male",img:"https://images.pexels.com/photos/9363214/pexels-photo-9363214.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"},
 {name:"AI Studio Pro",role:"Custom Avatar",img:"/images/avatar-studio.jpg"},
 {name:"Anime Hero",role:"Anime Avatar",img:"/images/anime-scene.jpg"},
];
export const TEMPLATE_CATS = ["All","YouTube","Reels / Shorts","Product Promo","Wedding / Birthday","News / Sports","Explainer","Corporate","Educational","Ads","Food","Fitness","Fashion","Tech","Travel","Urdu / Islamic","Kids","Podcast"];

const P = (id:number, w=1200, h=627) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=${h}&w=${w}`;

export const TEMPLATES=[
 {name:"YouTube Explainer Pro",cat:"YouTube",dur:"60s",ratio:"16:9",img:P(31158869),uses:"48k",style:"Cinematic",color:"#ff8a3d",prompt:"Professional YouTube explainer with hook, chapters and subscribe outro"},
 {name:"Viral Reels Hook",cat:"Reels / Shorts",dur:"15s",ratio:"9:16",img:P(8041226),uses:"92k",style:"Realistic",color:"#f43f5e",prompt:"Fast-cut viral reels hook, bold captions, 3-second pattern interrupt"},
 {name:"Product Promo — Chai",cat:"Product Promo",dur:"30s",ratio:"1:1",img:"/images/hero-video.jpg",uses:"31k",style:"Cinematic",color:"#f59e0b",prompt:"Steam rising from karak chai, cozy cafe product ad with Urdu voiceover"},
 {name:"Birthday Wish Urdu",cat:"Wedding / Birthday",dur:"30s",ratio:"9:16",img:P(6543909,800,1200),uses:"18k",style:"Cartoon",color:"#a855f7",prompt:"Colorful birthday wish video with Urdu poetry, confetti and cake reveal"},
 {name:"Wedding Highlight Film",cat:"Wedding / Birthday",dur:"60s",ratio:"16:9",img:P(29486082),uses:"22k",style:"Realistic",color:"#ec4899",prompt:"Elegant wedding highlight, mehndi lights, slow motion couple shots"},
 {name:"News Bulletin",cat:"News / Sports",dur:"60s",ratio:"16:9",img:"/images/avatar-studio.jpg",uses:"27k",style:"Realistic",color:"#0ea5e9",prompt:"AI news anchor presenting top stories with lower thirds and breaking badge"},
 {name:"Anime Short Story",cat:"Explainer",dur:"30s",ratio:"9:16",img:"/images/anime-scene.jpg",uses:"64k",style:"Anime",color:"#6366f1",prompt:"Anime hero overlooking a futuristic city, epic short story arc"},
 {name:"Corporate Presentation",cat:"Corporate",dur:"120s",ratio:"16:9",img:P(39071437),uses:"12k",style:"3D Animation",color:"#14b8a6",prompt:"Clean corporate presentation with data callouts and brand colors"},
 {name:"Education Lesson Urdu",cat:"Educational",dur:"90s",ratio:"16:9",img:P(8089650),uses:"39k",style:"Realistic",color:"#22c55e",prompt:"Urdu educational lesson with whiteboard, captions and friendly voice"},
 {name:"Facebook Ad Sale",cat:"Ads",dur:"15s",ratio:"4:5",img:P(30878454),uses:"55k",style:"Cinematic",color:"#ef4444",prompt:"Flash sale ad, bold price reveal, urgency countdown and CTA button"},
 {name:"Street Food Tour",cat:"Food",dur:"45s",ratio:"9:16",img:P(36904470),uses:"71k",style:"Realistic",color:"#f97316",prompt:"Night street food tour, sizzling pans, neon signs, hungry close-ups"},
 {name:"Cafe Ambience Reel",cat:"Food",dur:"20s",ratio:"9:16",img:P(12681089),uses:"26k",style:"Cinematic",color:"#eab308",prompt:"Warm cafe ambience, latte art pour, soft acoustic mood"},
 {name:"Gym Transformation",cat:"Fitness",dur:"30s",ratio:"9:16",img:P(17956264),uses:"43k",style:"Cinematic",color:"#84cc16",prompt:"Gym transformation before/after with hard cuts, sweat detail, motiv text"},
 {name:"Fitness Challenge 30 Day",cat:"Fitness",dur:"45s",ratio:"16:9",img:P(32695898),uses:"17k",style:"Realistic",color:"#10b981",prompt:"30 day fitness challenge intro with progress bars and countdown"},
 {name:"Fashion Lookbook",cat:"Fashion",dur:"30s",ratio:"9:16",img:P(33462322,800,1200),uses:"38k",style:"Realistic",color:"#d946ef",prompt:"Bold fashion lookbook, neon studio lighting, confident model walk"},
 {name:"Beauty Product Glow",cat:"Fashion",dur:"20s",ratio:"4:5",img:P(39325165,800,1200),uses:"29k",style:"Realistic",color:"#fb7185",prompt:"Beauty product hero shot, glowing skin, soft pastel background"},
 {name:"Tech Unboxing",cat:"Tech",dur:"40s",ratio:"16:9",img:P(31158869),uses:"33k",style:"Cinematic",color:"#3b82f6",prompt:"Tech unboxing with macro shots, neon desk setup, spec callouts"},
 {name:"App Promo Motion",cat:"Tech",dur:"30s",ratio:"9:16",img:P(8041225),uses:"21k",style:"3D Animation",color:"#8b5cf6",prompt:"App promo with floating UI screens, motion graphics and CTA"},
 {name:"Travel Vlog Intro",cat:"Travel",dur:"20s",ratio:"16:9",img:P(5849755),uses:"47k",style:"Cinematic",color:"#06b6d4",prompt:"Travel vlog intro, aerial coastline, wave slow-mo and map animation"},
 {name:"Mountain Drone Story",cat:"Travel",dur:"45s",ratio:"9:16",img:P(33272152),uses:"24k",style:"Cinematic",color:"#0d9488",prompt:"Mountain drone cinematic, misty peaks, epic reveal with title"},
 {name:"Islamic Reminder Urdu",cat:"Urdu / Islamic",dur:"60s",ratio:"9:16",img:P(9714792),uses:"58k",style:"Watercolor",color:"#059669",prompt:"Islamic reminder in Urdu with soft watercolor visuals and calm voice"},
 {name:"Urdu Poetry Reel",cat:"Urdu / Islamic",dur:"30s",ratio:"9:16",img:P(10289105),uses:"36k",style:"Sketch",color:"#7c3aed",prompt:"Urdu poetry reel, sketch visuals, karaoke subtitles and gentle music"},
 {name:"Kids Rhyme 3D",cat:"Kids",dur:"45s",ratio:"16:9",img:P(9363479,800,1200),uses:"19k",style:"3D Animation",color:"#f472b6",prompt:"Bright 3D kids rhyme with cute characters, big captions and cheerful voice"},
 {name:"Podcast Clips Pack",cat:"Podcast",dur:"60s",ratio:"9:16",img:P(7658850,800,1200),uses:"41k",style:"Realistic",color:"#64748b",prompt:"Podcast highlight clip with wave animation, speaker names and bold captions"},
];

export const STOCK=[
 {name:"Golden Beach Drone",type:"Video",img:"https://images.pexels.com/videos/5849755/2020-aerial-andalusia-beach-5849755.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",url:"https://videos.pexels.com/video-files/5849755/5849755-uhd_3840_2160_30fps.mp4"},
 {name:"Ocean Waves Slow-Mo",type:"Video",img:"https://images.pexels.com/videos/28805527/breaking-close-up-coast-impact-28805527.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",url:"https://videos.pexels.com/video-files/28805527/12482396_1920_1080_24fps.mp4"},
 {name:"City Skyline Aerial",type:"Video",img:"https://images.pexels.com/videos/40143395/4k-4k-beach-a7iv-australia-40143395.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",url:"https://videos.pexels.com/video-files/40143395/17145771_3360_1440_24fps.mp4"},
 {name:"Neon Cinema Camera",type:"Image",img:"https://images.pexels.com/photos/31158869/pexels-photo-31158869.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",url:""},
 {name:"Film Set Behind Scenes",type:"Image",img:"https://images.pexels.com/photos/8089662/pexels-photo-8089662.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",url:""},
 {name:"Studio Portrait",type:"Image",img:"https://images.pexels.com/photos/9363372/pexels-photo-9363372.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",url:""},
];
export const PLANS=[
 {name:"Free",price:0,credits:120,features:["120 credits / month","720p export","Mir AI watermark","10 templates","Urdu + English voices","Community support"]},
 {name:"Basic",price:1499,unit:"PKR/mo",credits:600,features:["600 credits","1080p export","No watermark","100+ templates","All voices + subtitles","JazzCash / EasyPaisa"]},
 {name:"Pro",price:3499,unit:"PKR/mo",credits:2000,popular:true,features:["2,000 credits","4K export","AI Avatars + Voice Clone","Unlimited templates","Team (3 members)","Priority GPU rendering","API access"]},
 {name:"Business",price:9999,unit:"PKR/mo",credits:8000,features:["8,000 credits","4K + batch export","Custom avatars","Team (15 members)","White-label","Dedicated support","Advanced analytics"]},
];
