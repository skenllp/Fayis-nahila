/* ========================================================================
   EDIT EVERYTHING HERE — names, events, story text, assets, API endpoints
   ======================================================================== */
window.SITE = {
  canonicalUrl: "",                       // e.g. "https://raneem-nahila.example.com/" (also edit <head> in index.html)
  // RSVP -> Google Sheet via Apps Script web app URL (see README step A). Empty = RSVP shows "not connected".
  rsvpEndpoint: "",
  // Wishes -> Firebase Firestore (REST, no SDK needed). Fill both from Firebase console (see README step B).
  firebase: { apiKey: "", projectId: "", collection: "wishes" },
  weddingDate: "2026-11-08T11:00:00+05:30", // 11:00 AM IST
  music: "assets/music/music.mp3",
  monogram: "assets/images/monogram.png",
  heroPhoto: "assets/images/couple.jpg",
  groom: {
    name: "Dr. Fayis Raneem A M", display: "Raneem", role: "Groom",
    parents: "A M Sanaulla & C K Najmunnisa", siblings: "Reja, Rana, Rafa",
    address: "Anandamangalath House, Trippanachi P.O., Malappuram", profession: "Dentist",
    photo: "assets/images/groom.jpg"
  },
  bride: {
    name: "Dr. Nahila C", display: "Nahila", role: "Bride",
    parents: "Abbas C & Najmunneessa P", siblings: "Nihal C, Nifan C, Nibil C",
    address: "Chennangadan (H), Edakkara P.O., Kooliminda", profession: "Dentist",
    photo: "assets/images/bride.jpg"
  },
  story: [
    { title: "It Began With a Story", date: "", full: "assets/images/story-full.jpg", photoAlt: "An Instagram story of Nahila with friends, the first glimpse he saw",
      lines: ["One ordinary Instagram story.", "A face he hadn't met yet.", "Shown to him by his parents...",
              "And somehow, that little moment became the beginning of something much bigger."] },
    { title: "And Then We Met", date: "15 February 2026", full: "assets/images/meeting-full.jpg",
      lines: ["What began as a proposal finally became a meeting.", "Two families.", "Two strangers.",
              "A first conversation that quietly changed everything."] },
    { title: "A Beautiful Beginning", date: "09 May 2026 — Engagement", photo: "assets/images/couple.jpg", natural: true, photoAlt: "Raneem and Nahila on their engagement day",
      lines: ["A promise was made, a beautiful journey began...",
              "With the blessings of Allah and the love and support of our families, we celebrated our engagement."] }
  ],
  timeline: [
    { icon: "family", title: "The First Meeting", date: "15 February 2026", text: "Two families. Two strangers. A first conversation that changed everything." },
    { icon: "rings", title: "The Engagement", date: "09 May 2026", text: "A promise was made, and a beautiful journey began..." },
    { icon: "book", title: "The Nikkah", date: "07 November 2026 | 11:00 AM", place: "Celebrations Auditorium, Munda, Malappuram", text: "The sacred beginning." },
    { icon: "canopy", title: "The Wedding", date: "08 November 2026 | 11:00 AM – 2:00 PM", place: "MKH Auditorium, Trippanachi, Malappuram", text: "And the story continues..." }
  ],
  events: [
    { title: "Nikkah", day: "Saturday, 7 November 2026", time: "11:00 AM", venue: "Celebrations Auditorium", place: "Munda, Malappuram",
      mapQuery: "Celebrations Auditorium, Munda, Malappuram" },
    { title: "Wedding Celebration", day: "Sunday, 8 November 2026", time: "11:00 AM – 2:00 PM", venue: "MKH Auditorium", place: "Trippanachi, Malappuram",
      mapQuery: "MKH Auditorium, Trippanachi, Malappuram" }
  ],
  gallery: [   // only the childhood photo for now; add more entries later and the gallery grows automatically
    { src: "assets/images/childhood.jpg", alt: "A childhood photograph of a boy and girl standing arm in arm" }
  ],
  family: {
    hosts: "Mr. A M Sanaulla & Mrs. C K Najmunnisa",
    address: ["Anandamangalath House,", "Trippanachi P.O., Malappuram"],
    phone: "9447412272",
    compliments: "Reja, Safwan, Rana, Rafa, Dear & Near."
  }
};
