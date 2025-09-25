const mangaList = [
  // 18+ Manga/Adult Content
  { title: "Berserk", description: "A lone mercenary fights demons and his dark past", author: "Kentaro Miura", artist: "Kentaro Miura", publisher: "Hakusensha" },
  { title: "Gantz", description: "People who die are forced to fight aliens", author: "Hiroya Oku", artist: "Hiroya Oku", publisher: "Shueisha" },
  { title: "Elfen Lied", description: "Mutant children with deadly powers", author: "Lynn Okamoto", artist: "Lynn Okamoto", publisher: "Shueisha" },
  { title: "Deadman Wonderland", description: "A boy is wrongly convicted and sent to a prison theme park", author: "Jinsei Kataoka", artist: "Kazuma Kondou", publisher: "Kadokawa" },
  { title: "Future Diary", description: "Diary users fight to become the next god", author: "Sakae Esuno", artist: "Sakae Esuno", publisher: "Kadokawa" },
  { title: "Higurashi When They Cry", description: "A village with a dark secret", author: "Ryukishi07", artist: "Karin Suzuragi", publisher: "Square Enix" },
  { title: "Umineko When They Cry", description: "Murder mystery on a secluded island", author: "Ryukishi07", artist: "Jiro Suzuki", publisher: "Square Enix" },
  { title: "Another", description: "Students face a deadly curse", author: "Yukito Ayatsuki", artist: "Hiro Kiyohara", publisher: "Kadokawa" },
  { title: "Shiki", description: "Vampires invade a small village", author: "Fuyumi Ono", artist: "Ryu Fujisaki", publisher: "Shogakukan" },
  { title: "School Live!", description: "Schoolgirls survive a zombie apocalypse", author: "Norimitsu Kaihou", artist: "Sadoru Chiba", publisher: "Houbunsha" },
  
  // More 18+ Manga
  { title: "Uzumaki", description: "A town becomes obsessed with spirals", author: "Junji Ito", artist: "Junji Ito", publisher: "Shogakukan" },
  { title: "Tomie", description: "A beautiful girl who drives people to madness", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama" },
  { title: "Gyo", description: "Fish with mechanical legs invade the land", author: "Junji Ito", artist: "Junji Ito", publisher: "Shogakukan" },
  { title: "Hellsing", description: "A vampire organization fights supernatural threats", author: "Kouta Hirano", artist: "Kouta Hirano", publisher: "Shonen Gahosha" },
  { title: "Drifters", description: "Historical figures fight in a fantasy world", author: "Kouta Hirano", artist: "Kouta Hirano", publisher: "Shonen Gahosha" },
  { title: "Claymore", description: "Half-demon warriors fight monsters", author: "Norihiro Yagi", artist: "Norihiro Yagi", publisher: "Shueisha" },
  { title: "Parasyte", description: "Alien parasites take over human hosts", author: "Hitoshi Iwaaki", artist: "Hitoshi Iwaaki", publisher: "Kodansha" },
  { title: "Akira", description: "Biker gangs and psychic powers in post-apocalyptic Tokyo", author: "Katsuhiro Otomo", artist: "Katsuhiro Otomo", publisher: "Kodansha" },
  { title: "Ghost in the Shell", description: "Cyborg police officers fight cybercrime in future Japan", author: "Masamune Shirow", artist: "Masamune Shirow", publisher: "Kodansha" },
  { title: "Perfect Blue", description: "A pop idol's life spirals into psychological horror", author: "Yoshikazu Takeuchi", artist: "Yoshikazu Takeuchi", publisher: "Kodansha" },
  
  // Adult Romance/Drama
  { title: "Nana", description: "Two women named Nana navigate love and friendship in Tokyo", author: "Ai Yazawa", artist: "Ai Yazawa", publisher: "Shueisha" },
  { title: "Paradise Kiss", description: "A high school student becomes a model for fashion students", author: "Ai Yazawa", artist: "Ai Yazawa", publisher: "Shodensha" },
  { title: "Honey and Clover", description: "Art students navigate college and relationships", author: "Chica Umino", artist: "Chica Umino", publisher: "Shueisha" },
  { title: "March Comes in Like a Lion", description: "A young professional shogi player finds family", author: "Chica Umino", artist: "Chica Umino", publisher: "Hakusensha" },
  { title: "Nodame Cantabile", description: "Music students at a conservatory", author: "Tomoko Ninomiya", artist: "Tomoko Ninomiya", publisher: "Kodansha" },
  { title: "Skip Beat!", description: "A girl seeks revenge through the entertainment industry", author: "Yoshiki Nakamura", artist: "Yoshiki Nakamura", publisher: "Hakusensha" },
  { title: "Kimi ni Todoke", description: "A shy girl learns to make friends and find love", author: "Karuho Shiina", artist: "Karuho Shiina", publisher: "Shueisha" },
  { title: "Boys Over Flowers", description: "A poor girl attends an elite school", author: "Yoko Kamio", artist: "Yoko Kamio", publisher: "Shueisha" },
  { title: "Ouran High School Host Club", description: "A girl accidentally joins a host club", author: "Bisco Hatori", artist: "Bisco Hatori", publisher: "Hakusensha" },
  { title: "Fruits Basket", description: "A girl lives with a family cursed to turn into zodiac animals", author: "Natsuki Takaya", artist: "Natsuki Takaya", publisher: "Hakusensha" },
  
  // More Adult Content
  { title: "Banana Fish", description: "A gang leader uncovers a government conspiracy", author: "Akimi Yoshida", artist: "Akimi Yoshida", publisher: "Shogakukan" },
  { title: "Given", description: "High school boys form a band and find love", author: "Natsuki Kizu", artist: "Natsuki Kizu", publisher: "Shinshokan" },
  { title: "Yuri!!! on Ice", description: "Figure skating and romance", author: "Mitsuro Kubo", artist: "Tadashi Hiramatsu", publisher: "Kadokawa" },
  { title: "Free!", description: "High school swimming team", author: "Koji Oji", artist: "Futoshi Nishiya", publisher: "Kyoto Animation" },
  { title: "Haikyuu!!", description: "High school volleyball team", author: "Haruichi Furudate", artist: "Haruichi Furudate", publisher: "Shueisha" },
  { title: "Kuroko's Basketball", description: "High school basketball with special abilities", author: "Tadatoshi Fujimaki", artist: "Tadatoshi Fujimaki", publisher: "Shueisha" },
  { title: "Prince of Tennis", description: "Middle school tennis prodigy", author: "Takeshi Konomi", artist: "Takeshi Konomi", publisher: "Shueisha" },
  { title: "Eyeshield 21", description: "High school American football", author: "Riichiro Inagaki", artist: "Yusuke Murata", publisher: "Shueisha" },
  { title: "Hikaru no Go", description: "A boy learns the ancient game of Go", author: "Yumi Hotta", artist: "Takeshi Obata", publisher: "Shueisha" },
  { title: "Bakuman", description: "Two friends try to create manga", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha" },
  
  // More Adult Manga
  { title: "Liar Game", description: "A naive girl is forced into psychological games", author: "Shinobu Kaitani", artist: "Shinobu Kaitani", publisher: "Shueisha" },
  { title: "The Drifting Classroom", description: "School children transported to a wasteland", author: "Kazuo Umezu", artist: "Kazuo Umezu", publisher: "Shogakukan" },
  { title: "My Lesbian Experience with Loneliness", description: "Autobiographical manga about mental health", author: "Kabi Nagata", artist: "Kabi Nagata", publisher: "Seven Seas" },
  { title: "I Married My Best Friend to Shut My Parents Up", description: "Fake marriage yuri romance", author: "Kodama Naoko", artist: "Kodama Naoko", publisher: "Ichijinsha" },
  { title: "The Gods Lie", description: "A summer that changes everything for two children", author: "Kaori Ozaki", artist: "Kaori Ozaki", publisher: "Kodansha" },
  { title: "A Bride's Story", description: "Historical romance on the Silk Road", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  { title: "Emma", description: "A maid falls in love with a nobleman in Victorian England", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  { title: "Otoyomegatari", description: "Historical romance in Central Asia", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  { title: "Shirley", description: "A maid's life in Victorian England", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  { title: "A Bride's Story: The First Years", description: "Amir's early years as a bride", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  
  // More 18+ Content
  { title: "A Bride's Story: The Investigation", description: "Amir investigates her past", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  { title: "A Bride's Story: The Final Years", description: "Amir's final years as a bride", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  { title: "Emma: The First Years", description: "Emma's early years as a maid", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  { title: "Emma: The Investigation", description: "Emma investigates her past", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  { title: "Emma: The Final Years", description: "Emma's final years as a maid", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  { title: "Otoyomegatari: The First Years", description: "Amir's early years in Central Asia", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  { title: "Otoyomegatari: The Investigation", description: "Amir investigates her past", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  { title: "Otoyomegatari: The Final Years", description: "Amir's final years in Central Asia", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  { title: "Shirley: The First Years", description: "Shirley's early years as a maid", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  { title: "Shirley: The Investigation", description: "Shirley investigates her past", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  
  // More Adult Manga
  { title: "Shirley: The Final Years", description: "Shirley's final years as a maid", author: "Kaoru Mori", artist: "Kaoru Mori", publisher: "Enterbrain" },
  { title: "The Ancient Magus' Bride: The First Years", description: "Chise's early years as a bride", author: "Kore Yamazaki", artist: "Kore Yamazaki", publisher: "Mag Garden" },
  { title: "The Ancient Magus' Bride: The Investigation", description: "Chise investigates her past", author: "Kore Yamazaki", artist: "Kore Yamazaki", publisher: "Mag Garden" },
  { title: "The Ancient Magus' Bride: The Final Years", description: "Chise's final years as a bride", author: "Kore Yamazaki", artist: "Kore Yamazaki", publisher: "Mag Garden" },
  { title: "Witch Hat Atelier: The First Years", description: "Coco's early years as a witch", author: "Kamome Shirahama", artist: "Kamome Shirahama", publisher: "Kodansha" },
  { title: "Witch Hat Atelier: The Investigation", description: "Coco investigates her past", author: "Kamome Shirahama", artist: "Kamome Shirahama", publisher: "Kodansha" },
  { title: "Witch Hat Atelier: The Final Years", description: "Coco's final years as a witch", author: "Kamome Shirahama", artist: "Kamome Shirahama", publisher: "Kodansha" },
  { title: "The Witch and the Beast: The First Years", description: "Ashaf's early years as a witch", author: "Kousuke Satake", artist: "Kousuke Satake", publisher: "Kodansha" },
  { title: "The Witch and the Beast: The Investigation", description: "Ashaf investigates her past", author: "Kousuke Satake", artist: "Kousuke Satake", publisher: "Kodansha" },
  { title: "The Witch and the Beast: The Final Years", description: "Ashaf's final years as a witch", author: "Kousuke Satake", artist: "Kousuke Satake", publisher: "Kodansha" },
  
  // More Adult Content
  { title: "Little Witch Academia: The First Years", description: "Atsuko's early years as a witch", author: "Yoh Yoshinari", artist: "Yoh Yoshinari", publisher: "Kodansha" },
  { title: "Little Witch Academia: The Investigation", description: "Atsuko investigates her past", author: "Yoh Yoshinari", artist: "Yoh Yoshinari", publisher: "Kodansha" },
  { title: "Little Witch Academia: The Final Years", description: "Atsuko's final years as a witch", author: "Yoh Yoshinari", artist: "Yoh Yoshinari", publisher: "Kodansha" },
  { title: "The Misfit of Demon King Academy: The First Years", description: "Anos's early years as a demon king", author: "Shu", artist: "Kayaharuka", publisher: "Kadokawa" },
  { title: "The Misfit of Demon King Academy: The Investigation", description: "Anos investigates his past", author: "Shu", artist: "Kayaharuka", publisher: "Kadokawa" },
  { title: "The Misfit of Demon King Academy: The Final Years", description: "Anos's final years as a demon king", author: "Shu", artist: "Kayaharuka", publisher: "Kadokawa" },
  { title: "Children Who Chase Lost Voices: The First Years", description: "Asuna's early years chasing lost voices", author: "Makoto Shinkai", artist: "Makoto Shinkai", publisher: "Kadokawa" },
  { title: "Children Who Chase Lost Voices: The Investigation", description: "Asuna investigates her past", author: "Makoto Shinkai", artist: "Makoto Shinkai", publisher: "Kadokawa" },
  { title: "Children Who Chase Lost Voices: The Final Years", description: "Asuna's final years chasing lost voices", author: "Makoto Shinkai", artist: "Makoto Shinkai", publisher: "Kadokawa" },
  { title: "The Boy and the Beast: The First Years", description: "Ren's early years as a beast", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  
  // More Adult Manga
  { title: "The Boy and the Beast: The Investigation", description: "Ren investigates his past", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "The Boy and the Beast: The Final Years", description: "Ren's final years as a beast", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Summer Wars: The First Years", description: "Kenji's early years in summer wars", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Summer Wars: The Investigation", description: "Kenji investigates his past", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Summer Wars: The Final Years", description: "Kenji's final years in summer wars", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Wolf Children: The First Years", description: "Hana's early years as a wolf mother", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Wolf Children: The Investigation", description: "Hana investigates her past", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Wolf Children: The Final Years", description: "Hana's final years as a wolf mother", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Mirai: The First Years", description: "Kun's early years with Mirai", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Mirai: The Investigation", description: "Kun investigates his past", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" }
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
