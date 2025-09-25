const mangaList = [
  // Classic manga we might have missed
  { title: "Touch", description: "Twin brothers compete for the same girl and baseball", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "Cross Game", description: "Baseball and romance spanning childhood to adulthood", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "H2", description: "High school baseball rivals and romance", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "Rough", description: "Swimming rivals who fall in love", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "Katsu!", description: "Boxing manga about proving oneself", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  
  // Seinen manga
  { title: "Monster", description: "A doctor hunts a psychopathic patient", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "20th Century Boys", description: "Childhood friends face a cult conspiracy", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "Pluto", description: "A robot detective investigates robot murders", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "Billy Bat", description: "A manga artist uncovers a conspiracy", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Kodansha" },
  { title: "Master Keaton", description: "An archaeologist solves mysteries", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  
  // Different publishers/genres
  { title: "Beck", description: "A teenager joins a rock band", author: "Harold Sakuishi", artist: "Harold Sakuishi", publisher: "Kodansha" },
  { title: "Solanin", description: "Young adults struggle with post-graduation life", author: "Inio Asano", artist: "Inio Asano", publisher: "Shogakukan" },
  { title: "Goodnight Punpun", description: "A surreal coming-of-age story", author: "Inio Asano", artist: "Inio Asano", publisher: "Shogakukan" },
  { title: "Dead Dead Demon's Dededede Destruction", description: "Alien invasion meets slice of life", author: "Inio Asano", artist: "Inio Asano", publisher: "Shogakukan" },
  { title: "A Girl on the Shore", description: "A controversial coming-of-age story", author: "Inio Asano", artist: "Inio Asano", publisher: "Shogakukan" },
  
  // Cult classics
  { title: "FLCL", description: "A boy's coming of age with robots and rock music", author: "Gainax", artist: "Hajime Ueda", publisher: "Kodansha" },
  { title: "Excel Saga", description: "Parody manga about world conquest", author: "Rikdo Koshi", artist: "Rikdo Koshi", publisher: "Shonen Gahosha" },
  { title: "Puni Puni Poemy", description: "Magical girl parody", author: "Shinichi Watanabe", artist: "Shinichi Watanabe", publisher: "ASCII Media Works" },
  { title: "Cromartie High School", description: "Delinquent school comedy", author: "Eiji Nonaka", artist: "Eiji Nonaka", publisher: "Kodansha" },
  { title: "Daily Lives of High School Boys", description: "Comedy about ordinary high school boys", author: "Yasunobu Yamauchi", artist: "Yasunobu Yamauchi", publisher: "Square Enix" },
  
  // Older classics
  { title: "Fist of the North Star", description: "Post-apocalyptic martial arts", author: "Buronson", artist: "Tetsuo Hara", publisher: "Shueisha" },
  { title: "Saint Seiya", description: "Knights protect the goddess Athena", author: "Masami Kurumada", artist: "Masami Kurumada", publisher: "Shueisha" },
  { title: "Captain Tsubasa", description: "Soccer prodigy aims for the World Cup", author: "Yoichi Takahashi", artist: "Yoichi Takahashi", publisher: "Shueisha" },
  { title: "City Hunter", description: "A sweeper takes on dangerous jobs in Tokyo", author: "Tsukasa Hojo", artist: "Tsukasa Hojo", publisher: "Shueisha" },
  { title: "Cat's Eye", description: "Cat burglars and police romance", author: "Tsukasa Hojo", artist: "Tsukasa Hojo", publisher: "Shueisha" },
  
  // Unique/experimental
  { title: "The Drifting Classroom", description: "School children transported to a wasteland", author: "Kazuo Umezu", artist: "Kazuo Umezu", publisher: "Shogakukan" },
  { title: "My Lesbian Experience with Loneliness", description: "Autobiographical manga about mental health", author: "Kabi Nagata", artist: "Kabi Nagata", publisher: "Seven Seas" },
  { title: "I Married My Best Friend to Shut My Parents Up", description: "Fake marriage yuri romance", author: "Kodama Naoko", artist: "Kodama Naoko", publisher: "Ichijinsha" },
  { title: "The Gods Lie", description: "A summer that changes everything for two children", author: "Kaori Ozaki", artist: "Kaori Ozaki", publisher: "Kodansha" },
  { title: "A Bride's Story", description: "Historical romance on the Silk Road", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" }
];

async function importManga() {
  const baseUrl = 'http://localhost:3000/api/dexi';
  
  for (const manga of mangaList) {
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...manga,
          autoSearchCovers: true
        })
      });
      
      const result = await response.json();
      if (result.success) {
        console.log(`✅ Imported: ${manga.title}`);
      } else {
        console.log(`❌ Failed: ${manga.title} - ${result.error}`);
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.log(`❌ Error importing ${manga.title}:`, error.message);
    }
  }
}

importManga();
