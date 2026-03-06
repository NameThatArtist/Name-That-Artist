/* ============================================================
   Name That Artist — Game Logic
   ============================================================ */

/* ---------- Difficulty config ---------- */
const DIFFICULTY_CONFIG = {
  easy:   { guesses: 7, songs: 3, label: '7 guesses · 3 songs shown' },
  normal: { guesses: 5, songs: 3, label: '5 guesses · 3 songs shown' },
  hard:   { guesses: 3, songs: 2, label: '3 guesses · 2 songs shown' },
};

/* ---------- State ---------- */
const state = {
  allArtists:        [],
  currentArtist:     null,
  categoryType:      null,  // 'decade' | 'genre' | 'random'
  currentCategory:   null,
  difficulty:        'normal',
  maxGuesses:        5,
  guessesRemaining:  5,
  songsShown:        3,
  hintsRevealed:     0,
  revealedSongs:     new Set(),
  songRevealedPos:   [new Set(), new Set(), new Set()],
  gameOver:          false,
  won:               false,
  score:             { wins: 0, losses: 0 },
  streak:            0,
};

/* ---------- Pack State ---------- */
const pack = {
  artists:    [],   // shuffled list for this run
  index:      0,    // current position (0-based)
  active:     false,
  stats: {
    correct:       0,
    guessesOnWins: 0,
    longestStreak: 0,
    currentStreak: 0,
  },
};

/* ---------- Embedded artist data (avoids fetch() restrictions on file://) ---------- */
/* To update: edit artists.json then paste the array value here via:
   node -e "const d=require('./artists.json');process.stdout.write(JSON.stringify(d.artists))" */
const ARTISTS_DATA = [{"name":"The Beatles","songs":["Come Together","Hey Jude","Let It Be"],"debut_year":1960,"genre":["Rock"],"decades":["60s","70s"],"country":"United Kingdom","aliases":["Beatles"]},{"name":"The Rolling Stones","songs":["Paint It Black","(I Can't Get No) Satisfaction","Sympathy for the Devil"],"debut_year":1962,"genre":["Rock"],"decades":["60s","70s","80s","90s","2000s","2010s"],"country":"United Kingdom","aliases":["Rolling Stones"]},{"name":"Led Zeppelin","songs":["Stairway to Heaven","Whole Lotta Love","Kashmir"],"debut_year":1968,"genre":["Rock","Metal"],"decades":["70s"],"country":"United Kingdom"},{"name":"Jimi Hendrix","songs":["Purple Haze","All Along the Watchtower","Voodoo Child (Slight Return)"],"debut_year":1966,"genre":["Rock"],"decades":["60s"],"country":"United States","aliases":["Hendrix"]},{"name":"The Doors","songs":["Light My Fire","Riders on the Storm","People Are Strange"],"debut_year":1965,"genre":["Rock"],"decades":["60s","70s"],"country":"United States","aliases":["Doors"]},{"name":"Pink Floyd","songs":["Comfortably Numb","Wish You Were Here","Another Brick in the Wall, Pt. 2"],"debut_year":1965,"genre":["Rock"],"decades":["70s","80s"],"country":"United Kingdom"},{"name":"Queen","songs":["Bohemian Rhapsody","Don't Stop Me Now","Somebody to Love"],"debut_year":1970,"genre":["Rock"],"decades":["70s","80s"],"country":"United Kingdom"},{"name":"David Bowie","songs":["Heroes","Space Oddity","Let's Dance"],"debut_year":1964,"genre":["Rock","Pop"],"decades":["70s","80s","90s","2000s"],"country":"United Kingdom","aliases":["Ziggy Stardust"]},{"name":"Fleetwood Mac","songs":["Dreams","Go Your Own Way","The Chain"],"debut_year":1967,"genre":["Rock"],"decades":["70s","80s"],"country":"United Kingdom"},{"name":"Eagles","songs":["Hotel California","Take It Easy","Desperado"],"debut_year":1971,"genre":["Rock","Country"],"decades":["70s","80s","90s"],"country":"United States","aliases":["The Eagles"]},{"name":"Elton John","songs":["Rocket Man","Tiny Dancer","Crocodile Rock"],"debut_year":1964,"genre":["Pop","Rock"],"decades":["70s","80s","90s","2000s"],"country":"United Kingdom"},{"name":"Bruce Springsteen","songs":["Born to Run","Born in the U.S.A.","Dancing in the Dark"],"debut_year":1972,"genre":["Rock"],"decades":["80s","90s"],"country":"United States","aliases":["The Boss"]},{"name":"Tom Petty","songs":["Free Fallin'","I Won't Back Down","American Girl"],"debut_year":1976,"genre":["Rock"],"decades":["80s","90s"],"country":"United States"},{"name":"The Police","songs":["Every Breath You Take","Roxanne","Don't Stand So Close to Me"],"debut_year":1977,"genre":["Rock"],"decades":["80s"],"country":"United Kingdom","aliases":["Police"]},{"name":"Bon Jovi","songs":["Livin' on a Prayer","It's My Life","Wanted Dead or Alive"],"debut_year":1983,"genre":["Rock"],"decades":["80s","90s","2000s"],"country":"United States"},{"name":"U2","songs":["With or Without You","One","Where the Streets Have No Name"],"debut_year":1976,"genre":["Rock"],"decades":["80s","90s","2000s","2010s"],"country":"Ireland"},{"name":"AC/DC","songs":["Back in Black","Highway to Hell","Thunderstruck"],"debut_year":1973,"genre":["Rock","Metal"],"decades":["80s","90s"],"country":"Australia"},{"name":"Bob Dylan","songs":["Blowin' in the Wind","Like a Rolling Stone","The Times They Are a-Changin'"],"debut_year":1962,"genre":["Rock"],"decades":["60s","70s","80s","90s"],"country":"United States"},{"name":"Simon & Garfunkel","songs":["The Sound of Silence","Mrs. Robinson","Bridge Over Troubled Water"],"debut_year":1964,"genre":["Rock"],"decades":["60s","70s"],"country":"United States","aliases":["Simon and Garfunkel"]},{"name":"The Beach Boys","songs":["Good Vibrations","Surfin' USA","God Only Knows"],"debut_year":1961,"genre":["Rock","Pop"],"decades":["60s","70s"],"country":"United States","aliases":["Beach Boys"]},{"name":"Nirvana","songs":["Smells Like Teen Spirit","Come as You Are","Heart-Shaped Box"],"debut_year":1987,"genre":["Rock"],"decades":["90s"],"country":"United States"},{"name":"Oasis","songs":["Wonderwall","Don't Look Back in Anger","Champagne Supernova"],"debut_year":1991,"genre":["Rock"],"decades":["90s","2000s"],"country":"United Kingdom"},{"name":"Radiohead","songs":["Creep","Karma Police","No Surprises"],"debut_year":1985,"genre":["Indie/Alternative"],"decades":["90s","2000s","2010s"],"country":"United Kingdom"},{"name":"Green Day","songs":["Basket Case","American Idiot","Good Riddance (Time of Your Life)"],"debut_year":1987,"genre":["Rock"],"decades":["90s","2000s","2010s"],"country":"United States"},{"name":"Foo Fighters","songs":["Everlong","Learn to Fly","Best of You"],"debut_year":1994,"genre":["Rock"],"decades":["90s","2000s","2010s","2020s"],"country":"United States"},{"name":"Red Hot Chili Peppers","songs":["Under the Bridge","Californication","Give It Away"],"debut_year":1983,"genre":["Rock"],"decades":["90s","2000s"],"country":"United States","aliases":["RHCP"]},{"name":"Alanis Morissette","songs":["You Oughta Know","Ironic","Hand in My Pocket"],"debut_year":1991,"genre":["Rock","Indie/Alternative"],"decades":["90s","2000s"],"country":"Canada"},{"name":"Arctic Monkeys","songs":["Do I Wanna Know?","R U Mine?","505"],"debut_year":2002,"genre":["Indie/Alternative","Rock"],"decades":["2000s","2010s","2020s"],"country":"United Kingdom"},{"name":"Coldplay","songs":["Yellow","The Scientist","Fix You"],"debut_year":1996,"genre":["Indie/Alternative"],"decades":["2000s","2010s","2020s"],"country":"United Kingdom"},{"name":"Gorillaz","songs":["Feel Good Inc.","Clint Eastwood","DARE"],"debut_year":1998,"genre":["Indie/Alternative","Electronic"],"decades":["2000s","2010s","2020s"],"country":"United Kingdom"},{"name":"Tame Impala","songs":["The Less I Know the Better","Let It Happen","Feels Like We Only Go Backwards"],"debut_year":2007,"genre":["Indie/Alternative"],"decades":["2010s","2020s"],"country":"Australia"},{"name":"Lorde","songs":["Royals","Green Light","Tennis Court"],"debut_year":2013,"genre":["Indie/Alternative","Pop"],"decades":["2010s","2020s"],"country":"New Zealand","aliases":["Ella Yelich-O'Connor"]},{"name":"Twenty One Pilots","songs":["Stressed Out","Ride","Heathens"],"debut_year":2009,"genre":["Indie/Alternative"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Imagine Dragons","songs":["Radioactive","Demons","Thunder"],"debut_year":2008,"genre":["Indie/Alternative","Rock"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Lana Del Rey","songs":["Summertime Sadness","Video Games","Young and Beautiful"],"debut_year":2012,"genre":["Indie/Alternative","Pop"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Metallica","songs":["Enter Sandman","Master of Puppets","One"],"debut_year":1981,"genre":["Metal"],"decades":["80s","90s","2000s","2010s"],"country":"United States"},{"name":"Guns N' Roses","songs":["Sweet Child O' Mine","Welcome to the Jungle","November Rain"],"debut_year":1985,"genre":["Metal","Rock"],"decades":["80s","90s"],"country":"United States","aliases":["GNR","Guns and Roses"]},{"name":"Def Leppard","songs":["Pour Some Sugar on Me","Photograph","Love Bites"],"debut_year":1977,"genre":["Metal","Rock"],"decades":["80s","90s"],"country":"United Kingdom"},{"name":"Linkin Park","songs":["In the End","Numb","Crawling"],"debut_year":1996,"genre":["Metal","Rock"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Black Sabbath","songs":["Iron Man","War Pigs","Paranoid"],"debut_year":1968,"genre":["Metal","Rock"],"decades":["70s","80s"],"country":"United Kingdom"},{"name":"Michael Jackson","songs":["Thriller","Billie Jean","Beat It"],"debut_year":1964,"genre":["Pop","R&B/Soul"],"decades":["80s","90s"],"country":"United States","aliases":["MJ","King of Pop"]},{"name":"Madonna","songs":["Like a Virgin","Material Girl","Papa Don't Preach"],"debut_year":1979,"genre":["Pop"],"decades":["80s","90s","2000s"],"country":"United States","aliases":["Queen of Pop"]},{"name":"Prince","songs":["Purple Rain","When Doves Cry","Kiss"],"debut_year":1978,"genre":["Pop","R&B/Soul"],"decades":["80s","90s"],"country":"United States"},{"name":"Whitney Houston","songs":["I Will Always Love You","Greatest Love of All","I Wanna Dance with Somebody (Who Loves Me)"],"debut_year":1983,"genre":["Pop","R&B/Soul"],"decades":["80s","90s"],"country":"United States"},{"name":"Mariah Carey","songs":["All I Want for Christmas Is You","We Belong Together","Fantasy"],"debut_year":1990,"genre":["Pop","R&B/Soul"],"decades":["90s","2000s","2010s"],"country":"United States"},{"name":"Cyndi Lauper","songs":["Girls Just Want to Have Fun","Time After Time","True Colors"],"debut_year":1978,"genre":["Pop"],"decades":["80s"],"country":"United States"},{"name":"George Michael","songs":["Careless Whisper","Faith","Father Figure"],"debut_year":1981,"genre":["Pop","R&B/Soul"],"decades":["80s","90s"],"country":"United Kingdom"},{"name":"ABBA","songs":["Dancing Queen","Mamma Mia","Waterloo"],"debut_year":1972,"genre":["Pop"],"decades":["70s"],"country":"Sweden"},{"name":"Duran Duran","songs":["Hungry Like the Wolf","Rio","Girls on Film"],"debut_year":1978,"genre":["Pop","Rock"],"decades":["80s","90s"],"country":"United Kingdom"},{"name":"Taylor Swift","songs":["Shake It Off","Blank Space","Anti-Hero"],"debut_year":2006,"genre":["Pop","Country"],"decades":["2000s","2010s","2020s"],"country":"United States"},{"name":"Katy Perry","songs":["Roar","Firework","Teenage Dream"],"debut_year":2001,"genre":["Pop"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Lady Gaga","songs":["Bad Romance","Poker Face","Just Dance"],"debut_year":2008,"genre":["Pop","Electronic"],"decades":["2000s","2010s","2020s"],"country":"United States"},{"name":"Rihanna","songs":["Umbrella","We Found Love","Diamonds"],"debut_year":2003,"genre":["Pop","R&B/Soul"],"decades":["2000s","2010s","2020s"],"country":"Barbados"},{"name":"Justin Timberlake","songs":["SexyBack","Can't Stop the Feeling!","Mirrors"],"debut_year":2003,"genre":["Pop","R&B/Soul"],"decades":["2000s","2010s","2020s"],"country":"United States","aliases":["JT"]},{"name":"Beyoncé","songs":["Crazy in Love","Irreplaceable","Single Ladies (Put a Ring on It)"],"debut_year":2003,"genre":["Pop","R&B/Soul"],"decades":["2000s","2010s","2020s"],"country":"United States","aliases":["Bey","Queen Bey"]},{"name":"Adele","songs":["Rolling in the Deep","Someone Like You","Hello"],"debut_year":2006,"genre":["Pop","R&B/Soul"],"decades":["2000s","2010s","2020s"],"country":"United Kingdom"},{"name":"Ed Sheeran","songs":["Shape of You","Perfect","Thinking Out Loud"],"debut_year":2011,"genre":["Pop"],"decades":["2010s","2020s"],"country":"United Kingdom"},{"name":"Bruno Mars","songs":["Uptown Funk","Just the Way You Are","Locked Out of Heaven"],"debut_year":2009,"genre":["Pop","R&B/Soul"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Ariana Grande","songs":["Thank U, Next","7 Rings","Problem"],"debut_year":2011,"genre":["Pop","R&B/Soul"],"decades":["2010s","2020s"],"country":"United States","aliases":["Ari"]},{"name":"Dua Lipa","songs":["Levitating","Don't Start Now","New Rules"],"debut_year":2015,"genre":["Pop","Electronic"],"decades":["2010s","2020s"],"country":"United Kingdom"},{"name":"Harry Styles","songs":["As It Was","Watermelon Sugar","Adore You"],"debut_year":2017,"genre":["Pop","Rock"],"decades":["2010s","2020s"],"country":"United Kingdom"},{"name":"Billie Eilish","songs":["bad guy","Happier Than Ever","Ocean Eyes"],"debut_year":2016,"genre":["Pop","Indie/Alternative"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Olivia Rodrigo","songs":["drivers license","good 4 u","Vampire"],"debut_year":2021,"genre":["Pop","Indie/Alternative"],"decades":["2020s"],"country":"United States"},{"name":"Sabrina Carpenter","songs":["Espresso","Please Please Please","Nonsense"],"debut_year":2014,"genre":["Pop"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Selena Gomez","songs":["Come & Get It","Lose You to Love Me","Wolves"],"debut_year":2009,"genre":["Pop"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Justin Bieber","songs":["Baby","Sorry","Love Yourself"],"debut_year":2009,"genre":["Pop"],"decades":["2010s","2020s"],"country":"Canada","aliases":["Biebs"]},{"name":"Eminem","songs":["Lose Yourself","The Real Slim Shady","Without Me"],"debut_year":1996,"genre":["Hip-Hop/Rap"],"decades":["90s","2000s","2010s"],"country":"United States","aliases":["Slim Shady","Marshall Mathers"]},{"name":"2Pac","songs":["California Love","Changes","Dear Mama"],"debut_year":1991,"genre":["Hip-Hop/Rap"],"decades":["90s"],"country":"United States","aliases":["Tupac","Tupac Shakur","Makaveli"]},{"name":"The Notorious B.I.G.","songs":["Hypnotize","Big Poppa","Mo Money Mo Problems"],"debut_year":1994,"genre":["Hip-Hop/Rap"],"decades":["90s"],"country":"United States","aliases":["Biggie","Biggie Smalls","Notorious BIG","Christopher Wallace"]},{"name":"Jay-Z","songs":["Empire State of Mind","99 Problems","Hard Knock Life (Ghetto Anthem)"],"debut_year":1996,"genre":["Hip-Hop/Rap"],"decades":["90s","2000s","2010s"],"country":"United States","aliases":["Hov","Shawn Carter"]},{"name":"Kanye West","songs":["Gold Digger","Stronger","Heartless"],"debut_year":2004,"genre":["Hip-Hop/Rap","Pop"],"decades":["2000s","2010s","2020s"],"country":"United States","aliases":["Ye","Yeezy"]},{"name":"Nicki Minaj","songs":["Super Bass","Starships","Anaconda"],"debut_year":2007,"genre":["Hip-Hop/Rap","Pop"],"decades":["2010s","2020s"],"country":"Trinidad and Tobago","aliases":["Nicki"]},{"name":"Drake","songs":["One Dance","God's Plan","Hotline Bling"],"debut_year":2006,"genre":["Hip-Hop/Rap","R&B/Soul"],"decades":["2000s","2010s","2020s"],"country":"Canada","aliases":["Drizzy","Champagne Papi"]},{"name":"Kendrick Lamar","songs":["HUMBLE.","Swimming Pools (Drank)","DNA."],"debut_year":2009,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","aliases":["K-Dot","Kdot"]},{"name":"Post Malone","songs":["Rockstar","Congratulations","Circles"],"debut_year":2015,"genre":["Hip-Hop/Rap","Pop"],"decades":["2010s","2020s"],"country":"United States","aliases":["Posty"]},{"name":"Cardi B","songs":["Bodak Yellow","I Like It","WAP"],"debut_year":2015,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Tyler the Creator","songs":["EARFQUAKE","See You Again","WUSYANAME"],"debut_year":2009,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","aliases":["Tyler"]},{"name":"Lil Nas X","songs":["Old Town Road","MONTERO (Call Me by Your Name)","INDUSTRY BABY"],"debut_year":2018,"genre":["Pop","Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States"},{"name":"50 Cent","songs":["In da Club","Candy Shop","21 Questions"],"debut_year":2002,"genre":["Hip-Hop/Rap"],"decades":["2000s"],"country":"United States","aliases":["Fifty Cent","Curtis Jackson"]},{"name":"The Black Eyed Peas","songs":["I Gotta Feeling","Where Is the Love?","Boom Boom Pow"],"debut_year":1995,"genre":["Hip-Hop/Rap","Pop"],"decades":["2000s","2010s"],"country":"United States","aliases":["Black Eyed Peas"]},{"name":"Childish Gambino","songs":["Redbone","This Is America","3005"],"debut_year":2011,"genre":["Hip-Hop/Rap","R&B/Soul"],"decades":["2010s","2020s"],"country":"United States","aliases":["Donald Glover"]},{"name":"Doja Cat","songs":["Say So","Kiss Me More","Planet Her"],"debut_year":2014,"genre":["Pop","Hip-Hop/Rap","R&B/Soul"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Lauryn Hill","songs":["Doo Wop (That Thing)","Ex-Factor","Everything Is Everything"],"debut_year":1993,"genre":["R&B/Soul","Hip-Hop/Rap"],"decades":["90s"],"country":"United States"},{"name":"Aretha Franklin","songs":["Respect","Think","(You Make Me Feel Like) A Natural Woman"],"debut_year":1961,"genre":["R&B/Soul"],"decades":["60s","70s","80s"],"country":"United States","aliases":["Queen of Soul"]},{"name":"Marvin Gaye","songs":["What's Going On","Let's Get It On","Sexual Healing"],"debut_year":1961,"genre":["R&B/Soul"],"decades":["60s","70s","80s"],"country":"United States"},{"name":"Stevie Wonder","songs":["Superstition","Sir Duke","Isn't She Lovely"],"debut_year":1961,"genre":["R&B/Soul","Pop"],"decades":["60s","70s","80s","90s"],"country":"United States"},{"name":"Bob Marley","songs":["No Woman No Cry","Redemption Song","One Love"],"debut_year":1963,"genre":["R&B/Soul"],"decades":["70s"],"country":"Jamaica","aliases":["Robert Nesta Marley"]},{"name":"Alicia Keys","songs":["Fallin'","No One","If I Ain't Got You"],"debut_year":1998,"genre":["R&B/Soul","Pop"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Usher","songs":["Yeah!","Confessions Part II","My Boo"],"debut_year":1994,"genre":["R&B/Soul","Pop"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Amy Winehouse","songs":["Rehab","Valerie","Back to Black"],"debut_year":2003,"genre":["R&B/Soul"],"decades":["2000s"],"country":"United Kingdom"},{"name":"Destiny's Child","songs":["Say My Name","Survivor","Bootylicious"],"debut_year":1993,"genre":["R&B/Soul","Pop"],"decades":["90s","2000s"],"country":"United States"},{"name":"Frank Ocean","songs":["Thinking Bout You","Novacane","Chanel"],"debut_year":2011,"genre":["R&B/Soul"],"decades":["2010s","2020s"],"country":"United States"},{"name":"SZA","songs":["Kill Bill","Good Days","Snooze"],"debut_year":2012,"genre":["R&B/Soul","Pop"],"decades":["2010s","2020s"],"country":"United States"},{"name":"John Legend","songs":["All of Me","Ordinary People","Tonight (Best You Ever Had)"],"debut_year":2004,"genre":["R&B/Soul","Pop"],"decades":["2000s","2010s","2020s"],"country":"United States"},{"name":"Sam Smith","songs":["Stay with Me","I'm Not the Only One","Unholy"],"debut_year":2012,"genre":["Pop","R&B/Soul"],"decades":["2010s","2020s"],"country":"United Kingdom"},{"name":"Khalid","songs":["Young Dumb & Broke","Location","Better"],"debut_year":2017,"genre":["R&B/Soul","Pop"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Anderson .Paak","songs":["Come Down","Make It Better","Tints"],"debut_year":2012,"genre":["R&B/Soul","Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","aliases":["Anderson Paak"]},{"name":"The Weeknd","songs":["Blinding Lights","Starboy","Can't Feel My Face"],"debut_year":2010,"genre":["R&B/Soul","Pop"],"decades":["2010s","2020s"],"country":"Canada","aliases":["Abel Tesfaye","Weeknd"]},{"name":"Daft Punk","songs":["Get Lucky","One More Time","Harder, Better, Faster, Stronger"],"debut_year":1993,"genre":["Electronic"],"decades":["90s","2000s","2010s"],"country":"France"},{"name":"Depeche Mode","songs":["Personal Jesus","Enjoy the Silence","Just Can't Get Enough"],"debut_year":1980,"genre":["Electronic"],"decades":["80s","90s","2000s"],"country":"United Kingdom"},{"name":"Donna Summer","songs":["Hot Stuff","I Feel Love","Last Dance"],"debut_year":1968,"genre":["Electronic","Pop"],"decades":["70s","80s"],"country":"United States","aliases":["Queen of Disco"]},{"name":"Calvin Harris","songs":["Summer","This Is What You Came For","Feel So Close"],"debut_year":2006,"genre":["Electronic","Pop"],"decades":["2000s","2010s","2020s"],"country":"United Kingdom"},{"name":"Avicii","songs":["Wake Me Up","Hey Brother","Levels"],"debut_year":2008,"genre":["Electronic"],"decades":["2010s"],"country":"Sweden","aliases":["Tim Bergling"]},{"name":"The Chainsmokers","songs":["Closer","Don't Let Me Down","Something Just Like This"],"debut_year":2012,"genre":["Electronic","Pop"],"decades":["2010s","2020s"],"country":"United States","aliases":["Chainsmokers"]},{"name":"Johnny Cash","songs":["Ring of Fire","Hurt","Man in Black"],"debut_year":1955,"genre":["Country"],"decades":["60s","70s","80s","90s"],"country":"United States","aliases":["The Man in Black"]},{"name":"Dolly Parton","songs":["Jolene","I Will Always Love You","9 to 5"],"debut_year":1964,"genre":["Country"],"decades":["70s","80s","90s","2000s"],"country":"United States"},{"name":"Garth Brooks","songs":["Friends in Low Places","The Dance","Unanswered Prayers"],"debut_year":1989,"genre":["Country"],"decades":["90s","2000s"],"country":"United States"},{"name":"Shania Twain","songs":["Man! I Feel Like a Woman!","You're Still the One","That Don't Impress Me Much"],"debut_year":1993,"genre":["Country","Pop"],"decades":["90s","2000s"],"country":"Canada"},{"name":"Willie Nelson","songs":["On the Road Again","Always on My Mind","Blue Eyes Crying in the Rain"],"debut_year":1956,"genre":["Country"],"decades":["70s","80s","90s"],"country":"United States"},{"name":"Morgan Wallen","songs":["Last Night","Wasted on You","More Than My Hometown"],"debut_year":2016,"genre":["Country"],"decades":["2020s"],"country":"United States"},{"name":"Chris Stapleton","songs":["Tennessee Whiskey","Broken Halos","Either Way"],"debut_year":2015,"genre":["Country"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Shakira","songs":["Hips Don't Lie","Waka Waka (This Time for Africa)","Whenever, Wherever"],"debut_year":1991,"genre":["Latin","Pop"],"decades":["90s","2000s","2010s","2020s"],"country":"Colombia"},{"name":"Bad Bunny","songs":["Dakiti","Me Porto Bonito","Tití Me Preguntó"],"debut_year":2016,"genre":["Latin"],"decades":["2010s","2020s"],"country":"Puerto Rico","aliases":["Benito"]},{"name":"Santana","songs":["Smooth","Black Magic Woman","Oye Como Va"],"debut_year":1966,"genre":["Latin","Rock"],"decades":["70s","80s","90s","2000s"],"country":"Mexico","aliases":["Carlos Santana"]},{"name":"J Balvin","songs":["Mi Gente","Reggaeton Ton (Bomba)","Con Calma"],"debut_year":2009,"genre":["Latin"],"decades":["2010s","2020s"],"country":"Colombia"},{"name":"Rosalía","songs":["DESPECHÁ","La Fama","Con Altura"],"debut_year":2017,"genre":["Latin","Pop"],"decades":["2010s","2020s"],"country":"Spain"},{"name":"Nelly","songs":["Hot in Herre","Dilemma","Just a Dream"],"debut_year":1999,"genre":["Hip-Hop/Rap","Pop"],"decades":["2000s"],"country":"United States"},{"name":"Iron Maiden","songs":["The Trooper","Run to the Hills","Fear of the Dark"],"debut_year":1975,"genre":["Metal"],"decades":["80s","90s"],"country":"United Kingdom"},{"name":"Slipknot","songs":["Psychosocial","Wait and Bleed","Duality"],"debut_year":1995,"genre":["Metal"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Ozzy Osbourne","songs":["Crazy Train","Mr. Crowley","Bark at the Moon"],"debut_year":1968,"genre":["Metal","Rock"],"decades":["80s","90s"],"country":"United Kingdom"},{"name":"Skrillex","songs":["Scary Monsters and Nice Sprites","First of the Year (Equinox)","Bangarang"],"debut_year":2010,"genre":["Electronic"],"decades":["2010s"],"country":"United States","aliases":["Sonny Moore"]},{"name":"Marshmello","songs":["Alone","Happier","Wolves"],"debut_year":2015,"genre":["Electronic","Pop"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Swedish House Mafia","songs":["Don't You Worry Child","One","Save the World"],"debut_year":2008,"genre":["Electronic"],"decades":["2010s"],"country":"Sweden"},{"name":"Enrique Iglesias","songs":["Hero","Bailando","I Like It"],"debut_year":1995,"genre":["Latin","Pop"],"decades":["90s","2000s","2010s"],"country":"Spain"},{"name":"Ozuna","songs":["Taki Taki","El Farsante","La Modelo"],"debut_year":2012,"genre":["Latin"],"decades":["2010s","2020s"],"country":"Puerto Rico"},{"name":"The Strokes","songs":["Last Nite","Reptilia","Someday"],"debut_year":1998,"genre":["Indie/Alternative","Rock"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Vampire Weekend","songs":["A-Punk","Cousins","Harmony Hall"],"debut_year":2006,"genre":["Indie/Alternative"],"decades":["2000s","2010s","2020s"],"country":"United States"},{"name":"Glass Animals","songs":["Heat Waves","Gooey","Pork Soda"],"debut_year":2012,"genre":["Indie/Alternative"],"decades":["2010s","2020s"],"country":"United Kingdom"},{"name":"The 1975","songs":["Somebody Else","Robbers","The Sound"],"debut_year":2013,"genre":["Indie/Alternative","Pop"],"decades":["2010s","2020s"],"country":"United Kingdom"},{"name":"The Who","songs":["My Generation","Baba O'Riley","Pinball Wizard"],"debut_year":1964,"genre":["Rock"],"decades":["60s","70s"],"country":"United Kingdom"},{"name":"The Kinks","songs":["You Really Got Me","Lola","Waterloo Sunset"],"debut_year":1964,"genre":["Rock"],"decades":["60s","70s"],"country":"United Kingdom"},{"name":"The Supremes","songs":["Stop! In the Name of Love","You Can't Hurry Love","Baby Love"],"debut_year":1961,"genre":["R&B/Soul","Pop"],"decades":["60s","70s"],"country":"United States"},{"name":"The Temptations","songs":["My Girl","Papa Was a Rollin' Stone","Ain't Too Proud to Beg"],"debut_year":1960,"genre":["R&B/Soul"],"decades":["60s","70s"],"country":"United States"},{"name":"James Brown","songs":["I Got You (I Feel Good)","Sex Machine","Papa's Got a Brand New Bag"],"debut_year":1956,"genre":["R&B/Soul"],"decades":["60s","70s"],"country":"United States"},{"name":"Ray Charles","songs":["Hit the Road Jack","Georgia on My Mind","What'd I Say"],"debut_year":1954,"genre":["R&B/Soul"],"decades":["60s","70s"],"country":"United States"},{"name":"Sam Cooke","songs":["A Change Is Gonna Come","You Send Me","Wonderful World"],"debut_year":1957,"genre":["R&B/Soul","Pop"],"decades":["60s"],"country":"United States"},{"name":"Otis Redding","songs":["(Sittin' On) The Dock of the Bay","Respect","Try a Little Tenderness"],"debut_year":1963,"genre":["R&B/Soul"],"decades":["60s"],"country":"United States"},{"name":"Bee Gees","songs":["Stayin' Alive","How Deep Is Your Love","Night Fever"],"debut_year":1958,"genre":["Pop","R&B/Soul"],"decades":["60s","70s","80s"],"country":"United Kingdom"},{"name":"Lynyrd Skynyrd","songs":["Sweet Home Alabama","Free Bird","Simple Man"],"debut_year":1964,"genre":["Rock"],"decades":["70s"],"country":"United States"},{"name":"Blondie","songs":["Heart of Glass","Call Me","One Way or Another"],"debut_year":1974,"genre":["Rock","Pop"],"decades":["70s","80s"],"country":"United States"},{"name":"Billy Joel","songs":["Piano Man","It's Still Rock and Roll to Me","We Didn't Start the Fire"],"debut_year":1971,"genre":["Rock","Pop"],"decades":["70s","80s"],"country":"United States"},{"name":"Dire Straits","songs":["Money for Nothing","Sultans of Swing","Romeo and Juliet"],"debut_year":1977,"genre":["Rock"],"decades":["70s","80s"],"country":"United Kingdom"},{"name":"Phil Collins","songs":["In the Air Tonight","Against All Odds","Sussudio"],"debut_year":1981,"genre":["Pop","Rock"],"decades":["80s","90s"],"country":"United Kingdom"},{"name":"The Ramones","songs":["Blitzkrieg Bop","I Wanna Be Sedated","Rock 'n' Roll High School"],"debut_year":1976,"genre":["Rock"],"decades":["70s","80s"],"country":"United States"},{"name":"The Clash","songs":["London Calling","Should I Stay or Should I Go","Rock the Casbah"],"debut_year":1976,"genre":["Rock"],"decades":["70s","80s"],"country":"United Kingdom"},{"name":"Genesis","songs":["Invisible Touch","Land of Confusion","Follow You Follow Me"],"debut_year":1967,"genre":["Rock","Pop"],"decades":["70s","80s"],"country":"United Kingdom"},{"name":"Neil Young","songs":["Heart of Gold","Rockin' in the Free World","Old Man"],"debut_year":1966,"genre":["Rock","Indie/Alternative"],"decades":["60s","70s","80s","90s"],"country":"Canada"},{"name":"Joni Mitchell","songs":["Big Yellow Taxi","Both Sides Now","River"],"debut_year":1968,"genre":["Rock","Indie/Alternative"],"decades":["60s","70s"],"country":"Canada"},{"name":"Cat Stevens","songs":["Wild World","Father and Son","Tea for the Tillerman"],"debut_year":1966,"genre":["Rock","Pop"],"decades":["60s","70s"],"country":"United Kingdom"},{"name":"Creedence Clearwater Revival","songs":["Proud Mary","Bad Moon Rising","Have You Ever Seen the Rain"],"debut_year":1967,"genre":["Rock"],"decades":["60s","70s"],"country":"United States"},{"name":"Aerosmith","songs":["Dream On","Sweet Emotion","Walk This Way"],"debut_year":1970,"genre":["Rock"],"decades":["70s","80s","90s"],"country":"United States"},{"name":"ZZ Top","songs":["Sharp Dressed Man","Legs","La Grange"],"debut_year":1969,"genre":["Rock"],"decades":["70s","80s"],"country":"United States"},{"name":"Journey","songs":["Don't Stop Believin'","Open Arms","Any Way You Want It"],"debut_year":1973,"genre":["Rock","Pop"],"decades":["70s","80s"],"country":"United States"},{"name":"Foreigner","songs":["I Want to Know What Love Is","Cold as Ice","Juke Box Hero"],"debut_year":1976,"genre":["Rock","Pop"],"decades":["70s","80s"],"country":"United States"},{"name":"Van Morrison","songs":["Brown Eyed Girl","Moondance","Into the Mystic"],"debut_year":1964,"genre":["Rock","R&B/Soul"],"decades":["60s","70s"],"country":"United Kingdom"},{"name":"Stevie Nicks","songs":["Edge of Seventeen","Stop Draggin' My Heart Around","Stand Back"],"debut_year":1981,"genre":["Rock","Pop"],"decades":["80s","90s"],"country":"United States"},{"name":"Heart","songs":["Barracuda","Crazy on You","Alone"],"debut_year":1973,"genre":["Rock"],"decades":["70s","80s"],"country":"United States"},{"name":"Hall & Oates","songs":["Maneater","Rich Girl","Sara Smile"],"debut_year":1972,"genre":["Pop","R&B/Soul"],"decades":["70s","80s"],"country":"United States"},{"name":"The Cure","songs":["Boys Don't Cry","Lovesong","Friday I'm in Love"],"debut_year":1978,"genre":["Rock","Indie/Alternative"],"decades":["80s","90s"],"country":"United Kingdom"},{"name":"New Order","songs":["Blue Monday","Bizarre Love Triangle","True Faith"],"debut_year":1980,"genre":["Electronic","Rock"],"decades":["80s","90s"],"country":"United Kingdom"},{"name":"Tears for Fears","songs":["Everybody Wants to Rule the World","Shout","Mad World"],"debut_year":1981,"genre":["Pop","Rock"],"decades":["80s"],"country":"United Kingdom"},{"name":"Eurythmics","songs":["Sweet Dreams (Are Made of This)","Here Comes the Rain Again","Would I Lie to You"],"debut_year":1980,"genre":["Pop","Electronic"],"decades":["80s"],"country":"United Kingdom"},{"name":"Janet Jackson","songs":["Nasty","That's the Way Love Goes","All for You"],"debut_year":1982,"genre":["Pop","R&B/Soul"],"decades":["80s","90s","2000s"],"country":"United States"},{"name":"Tina Turner","songs":["What's Love Got to Do with It","Private Dancer","Simply the Best"],"debut_year":1958,"genre":["Rock","R&B/Soul"],"decades":["60s","70s","80s"],"country":"United States"},{"name":"A-ha","songs":["Take On Me","The Sun Always Shines on T.V.","Hunting High and Low"],"debut_year":1982,"genre":["Pop"],"decades":["80s"],"country":"Norway"},{"name":"Wham!","songs":["Wake Me Up Before You Go-Go","Careless Whisper","Last Christmas"],"debut_year":1981,"genre":["Pop"],"decades":["80s"],"country":"United Kingdom"},{"name":"Culture Club","songs":["Karma Chameleon","Do You Really Want to Hurt Me","Church of the Poison Mind"],"debut_year":1981,"genre":["Pop"],"decades":["80s"],"country":"United Kingdom"},{"name":"Van Halen","songs":["Jump","Panama","Hot for Teacher"],"debut_year":1974,"genre":["Rock"],"decades":["80s"],"country":"United States"},{"name":"Mötley Crüe","songs":["Girls, Girls, Girls","Dr. Feelgood","Kickstart My Heart"],"debut_year":1981,"genre":["Rock","Metal"],"decades":["80s","90s"],"country":"United States"},{"name":"Peter Gabriel","songs":["Sledgehammer","In Your Eyes","Solsbury Hill"],"debut_year":1977,"genre":["Rock","Pop"],"decades":["80s","90s"],"country":"United Kingdom"},{"name":"R.E.M.","songs":["Losing My Religion","Everybody Hurts","Man on the Moon"],"debut_year":1980,"genre":["Rock","Indie/Alternative"],"decades":["80s","90s"],"country":"United States"},{"name":"Talking Heads","songs":["Psycho Killer","Burning Down the House","Once in a Lifetime"],"debut_year":1975,"genre":["Rock","Electronic"],"decades":["70s","80s"],"country":"United States"},{"name":"The Smiths","songs":["There Is a Light That Never Goes Out","How Soon Is Now?","This Charming Man"],"debut_year":1982,"genre":["Rock","Indie/Alternative"],"decades":["80s"],"country":"United Kingdom"},{"name":"Pet Shop Boys","songs":["West End Girls","It's a Sin","Always on My Mind"],"debut_year":1981,"genre":["Electronic","Pop"],"decades":["80s","90s"],"country":"United Kingdom"},{"name":"The Human League","songs":["Don't You Want Me","Fascination","Human"],"debut_year":1977,"genre":["Electronic","Pop"],"decades":["80s"],"country":"United Kingdom"},{"name":"Beastie Boys","songs":["(You Gotta) Fight for Your Right (To Party)","Sabotage","Intergalactic"],"debut_year":1981,"genre":["Hip-Hop/Rap","Rock"],"decades":["80s","90s"],"country":"United States"},{"name":"Public Enemy","songs":["Fight the Power","911 Is a Joke","Don't Believe the Hype"],"debut_year":1985,"genre":["Hip-Hop/Rap"],"decades":["80s","90s"],"country":"United States"},{"name":"Run-DMC","songs":["Walk This Way","It's Tricky","My Adidas"],"debut_year":1983,"genre":["Hip-Hop/Rap"],"decades":["80s","90s"],"country":"United States"},{"name":"Rick Astley","songs":["Never Gonna Give You Up","Together Forever","Whenever You Need Somebody"],"debut_year":1987,"genre":["Pop"],"decades":["80s"],"country":"United Kingdom"},{"name":"Salt-N-Pepa","songs":["Push It","Shoop","Whatta Man"],"debut_year":1985,"genre":["Hip-Hop/Rap"],"decades":["80s","90s"],"country":"United States"},{"name":"Backstreet Boys","songs":["I Want It That Way","Everybody (Backstreet's Back)","As Long as You Love Me"],"debut_year":1993,"genre":["Pop"],"decades":["90s","2000s"],"country":"United States"},{"name":"NSYNC","songs":["Bye Bye Bye","It's Gonna Be Me","Tearin' Up My Heart"],"debut_year":1995,"genre":["Pop"],"decades":["90s","2000s"],"country":"United States"},{"name":"Spice Girls","songs":["Wannabe","Say You'll Be There","2 Become 1"],"debut_year":1994,"genre":["Pop"],"decades":["90s"],"country":"United Kingdom"},{"name":"Pearl Jam","songs":["Alive","Black","Even Flow"],"debut_year":1990,"genre":["Rock"],"decades":["90s","2000s"],"country":"United States"},{"name":"Soundgarden","songs":["Black Hole Sun","Spoonman","Fell on Black Days"],"debut_year":1984,"genre":["Rock","Metal"],"decades":["90s"],"country":"United States"},{"name":"Alice in Chains","songs":["Would?","Rooster","Down in a Hole"],"debut_year":1987,"genre":["Rock","Metal"],"decades":["90s","2000s"],"country":"United States"},{"name":"Stone Temple Pilots","songs":["Plush","Creep","Vasoline"],"debut_year":1989,"genre":["Rock"],"decades":["90s"],"country":"United States"},{"name":"Blur","songs":["Song 2","Girls & Boys","Coffee & TV"],"debut_year":1988,"genre":["Rock","Indie/Alternative"],"decades":["90s"],"country":"United Kingdom"},{"name":"Pulp","songs":["Common People","Disco 2000","Babies"],"debut_year":1978,"genre":["Indie/Alternative","Pop"],"decades":["90s"],"country":"United Kingdom"},{"name":"Weezer","songs":["Undone – The Sweater Song","Buddy Holly","Say It Ain't So"],"debut_year":1993,"genre":["Rock","Indie/Alternative"],"decades":["90s","2000s"],"country":"United States"},{"name":"Beck","songs":["Loser","Where It's At","Devils Haircut"],"debut_year":1993,"genre":["Rock","Indie/Alternative"],"decades":["90s","2000s"],"country":"United States"},{"name":"Garbage","songs":["Stupid Girl","Only Happy When It Rains","Push It"],"debut_year":1994,"genre":["Rock","Indie/Alternative"],"decades":["90s"],"country":"United States"},{"name":"Portishead","songs":["Sour Times","Glory Box","Roads"],"debut_year":1991,"genre":["Electronic","Indie/Alternative"],"decades":["90s"],"country":"United Kingdom"},{"name":"Massive Attack","songs":["Teardrop","Angel","Unfinished Sympathy"],"debut_year":1988,"genre":["Electronic"],"decades":["90s","2000s"],"country":"United Kingdom"},{"name":"Smashing Pumpkins","songs":["1979","Tonight, Tonight","Bullet with Butterfly Wings"],"debut_year":1988,"genre":["Rock","Indie/Alternative"],"decades":["90s","2000s"],"country":"United States"},{"name":"Nine Inch Nails","songs":["Closer","Hurt","Head Like a Hole"],"debut_year":1988,"genre":["Rock","Metal","Electronic"],"decades":["90s","2000s"],"country":"United States"},{"name":"Blink-182","songs":["All the Small Things","What's My Age Again?","Dammit"],"debut_year":1992,"genre":["Rock"],"decades":["90s","2000s"],"country":"United States"},{"name":"Nas","songs":["N.Y. State of Mind","If I Ruled the World","One Love"],"debut_year":1994,"genre":["Hip-Hop/Rap"],"decades":["90s","2000s"],"country":"United States"},{"name":"Wu-Tang Clan","songs":["C.R.E.A.M.","Protect Ya Neck","Gravel Pit"],"debut_year":1993,"genre":["Hip-Hop/Rap"],"decades":["90s","2000s"],"country":"United States"},{"name":"A Tribe Called Quest","songs":["Can I Kick It?","Electric Relaxation","Award Tour"],"debut_year":1988,"genre":["Hip-Hop/Rap"],"decades":["90s"],"country":"United States"},{"name":"Missy Elliott","songs":["Work It","Get Ur Freak On","Lose Control"],"debut_year":1997,"genre":["Hip-Hop/Rap","R&B/Soul"],"decades":["90s","2000s"],"country":"United States"},{"name":"DMX","songs":["Party Up (Up in Here)","Where the Hood At","Ruff Ryders' Anthem"],"debut_year":1998,"genre":["Hip-Hop/Rap"],"decades":["90s","2000s"],"country":"United States"},{"name":"Outkast","songs":["Hey Ya!","Ms. Jackson","B.O.B."],"debut_year":1994,"genre":["Hip-Hop/Rap"],"decades":["90s","2000s"],"country":"United States"},{"name":"Snoop Dogg","songs":["Drop It Like It's Hot","Beautiful","Who Am I? (What's My Name?)"],"debut_year":1993,"genre":["Hip-Hop/Rap"],"decades":["90s","2000s","2010s"],"country":"United States"},{"name":"Fugees","songs":["Killing Me Softly","Ready or Not","Fu-Gee-La"],"debut_year":1994,"genre":["Hip-Hop/Rap","R&B/Soul"],"decades":["90s"],"country":"United States"},{"name":"TLC","songs":["Waterfalls","No Scrubs","Creep"],"debut_year":1991,"genre":["R&B/Soul","Pop"],"decades":["90s"],"country":"United States"},{"name":"Boyz II Men","songs":["End of the Road","I'll Make Love to You","On Bended Knee"],"debut_year":1988,"genre":["R&B/Soul"],"decades":["90s"],"country":"United States"},{"name":"Brandy","songs":["Have You Ever","The Boy Is Mine","I Wanna Be Down"],"debut_year":1994,"genre":["R&B/Soul","Pop"],"decades":["90s","2000s"],"country":"United States"},{"name":"My Chemical Romance","songs":["Welcome to the Black Parade","I'm Not Okay (I Promise)","Helena"],"debut_year":2001,"genre":["Rock"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Fall Out Boy","songs":["Sugar, We're Goin Down","Thnks fr th Mmrs","Dance, Dance"],"debut_year":2001,"genre":["Rock","Pop"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Paramore","songs":["Misery Business","Decode","The Only Exception"],"debut_year":2004,"genre":["Rock","Pop"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Panic! at the Disco","songs":["I Write Sins Not Tragedies","Nine in the Afternoon","High Hopes"],"debut_year":2004,"genre":["Rock","Pop"],"decades":["2000s","2010s"],"country":"United States"},{"name":"The Killers","songs":["Mr. Brightside","Somebody Told Me","Human"],"debut_year":2001,"genre":["Rock","Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Franz Ferdinand","songs":["Take Me Out","Do You Want To","This Fire"],"debut_year":2002,"genre":["Rock","Indie/Alternative"],"decades":["2000s"],"country":"United Kingdom"},{"name":"Arcade Fire","songs":["Wake Up","Rebellion (Lies)","Sprawl II (Mountains Beyond Mountains)"],"debut_year":2001,"genre":["Indie/Alternative"],"decades":["2000s","2010s"],"country":"Canada"},{"name":"Interpol","songs":["Obstacle 1","Slow Hands","Evil"],"debut_year":1997,"genre":["Rock","Indie/Alternative"],"decades":["2000s"],"country":"United States"},{"name":"Lil Wayne","songs":["A Milli","Lollipop","How to Love"],"debut_year":1995,"genre":["Hip-Hop/Rap"],"decades":["2000s","2010s"],"country":"United States"},{"name":"P!nk","songs":["So What","Just Give Me a Reason","Get the Party Started"],"debut_year":2000,"genre":["Pop","Rock"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Nelly Furtado","songs":["Maneater","Promiscuous","I'm Like a Bird"],"debut_year":2000,"genre":["Pop"],"decades":["2000s"],"country":"Canada"},{"name":"Ne-Yo","songs":["So Sick","Miss Independent","Closer"],"debut_year":2006,"genre":["R&B/Soul","Pop"],"decades":["2000s","2010s"],"country":"United States"},{"name":"T.I.","songs":["Whatever You Like","Live Your Life","Dead and Gone"],"debut_year":2001,"genre":["Hip-Hop/Rap"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Chris Brown","songs":["With You","Yeah 3x","Look at Me Now"],"debut_year":2005,"genre":["R&B/Soul","Pop"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Nickelback","songs":["How You Remind Me","Photograph","Rock Star"],"debut_year":1995,"genre":["Rock"],"decades":["2000s","2010s"],"country":"Canada"},{"name":"Avril Lavigne","songs":["Complicated","Sk8er Boi","Girlfriend"],"debut_year":2002,"genre":["Rock","Pop"],"decades":["2000s","2010s"],"country":"Canada"},{"name":"Evanescence","songs":["Bring Me to Life","My Immortal","Going Under"],"debut_year":1995,"genre":["Rock","Metal"],"decades":["2000s"],"country":"United States"},{"name":"John Mayer","songs":["Your Body Is a Wonderland","Gravity","Slow Dancing in a Burning Room"],"debut_year":2001,"genre":["Pop","Rock"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Norah Jones","songs":["Come Away with Me","Don't Know Why","Sunrise"],"debut_year":2002,"genre":["Pop","R&B/Soul"],"decades":["2000s"],"country":"United States"},{"name":"Maroon 5","songs":["Sugar","This Love","Girls Like You"],"debut_year":1994,"genre":["Pop","Rock"],"decades":["2000s","2010s"],"country":"United States"},{"name":"OneRepublic","songs":["Apologize","Counting Stars","Secrets"],"debut_year":2002,"genre":["Pop","Rock"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Kings of Leon","songs":["Use Somebody","Sex on Fire","Closer"],"debut_year":2000,"genre":["Rock","Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Snow Patrol","songs":["Chasing Cars","Run","Open Your Eyes"],"debut_year":1994,"genre":["Rock","Indie/Alternative"],"decades":["2000s","2010s"],"country":"United Kingdom"},{"name":"Keane","songs":["Somewhere Only We Know","Everybody's Changing","Bedshaped"],"debut_year":1997,"genre":["Rock","Pop"],"decades":["2000s","2010s"],"country":"United Kingdom"},{"name":"The White Stripes","songs":["Seven Nation Army","Fell in Love with a Girl","Icky Thump"],"debut_year":1997,"genre":["Rock"],"decades":["2000s"],"country":"United States"},{"name":"The Black Keys","songs":["Lonely Boy","Gold on the Ceiling","Howlin' for You"],"debut_year":2001,"genre":["Rock"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Muse","songs":["Supermassive Black Hole","Uprising","Starlight"],"debut_year":1994,"genre":["Rock","Electronic"],"decades":["2000s","2010s"],"country":"United Kingdom"},{"name":"Queens of the Stone Age","songs":["No One Knows","Little Sister","Go with the Flow"],"debut_year":1997,"genre":["Rock","Metal"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Modest Mouse","songs":["Float On","Dashboard","Dramamine"],"debut_year":1992,"genre":["Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Death Cab for Cutie","songs":["I Will Follow You into the Dark","Soul Meets Body","The Sound of Settling"],"debut_year":1997,"genre":["Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States"},{"name":"BTS","songs":["Dynamite","Butter","Boy With Luv"],"debut_year":2013,"genre":["Pop"],"decades":["2010s","2020s"],"country":"South Korea"},{"name":"BLACKPINK","songs":["DDU-DU DDU-DU","Kill This Love","How You Like That"],"debut_year":2016,"genre":["Pop"],"decades":["2010s","2020s"],"country":"South Korea"},{"name":"Travis Scott","songs":["SICKO MODE","Goosebumps","Antidote"],"debut_year":2013,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Future","songs":["Mask Off","March Madness","Low Life"],"debut_year":2012,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States"},{"name":"J. Cole","songs":["No Role Modelz","Middle Child","Power Trip"],"debut_year":2011,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Macklemore","songs":["Thrift Shop","Can't Hold Us","Same Love"],"debut_year":2000,"genre":["Hip-Hop/Rap"],"decades":["2010s"],"country":"United States"},{"name":"Halsey","songs":["Without Me","Bad at Love","Nightmare"],"debut_year":2014,"genre":["Pop","Indie/Alternative"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Hozier","songs":["Take Me to Church","From Eden","Cherry Wine"],"debut_year":2013,"genre":["Indie/Alternative","Rock"],"decades":["2010s","2020s"],"country":"Ireland"},{"name":"Mumford & Sons","songs":["Little Lion Man","The Cave","I Will Wait"],"debut_year":2007,"genre":["Indie/Alternative","Rock"],"decades":["2010s"],"country":"United Kingdom"},{"name":"Florence + the Machine","songs":["Dog Days Are Over","Shake It Out","You've Got the Love"],"debut_year":2007,"genre":["Indie/Alternative","Pop"],"decades":["2000s","2010s"],"country":"United Kingdom"},{"name":"Sia","songs":["Chandelier","Cheap Thrills","Elastic Heart"],"debut_year":2000,"genre":["Pop"],"decades":["2010s"],"country":"Australia"},{"name":"Bastille","songs":["Pompeii","Good Grief","Things We Lost in the Fire"],"debut_year":2010,"genre":["Indie/Alternative","Pop"],"decades":["2010s"],"country":"United Kingdom"},{"name":"Alt-J","songs":["Something Good","Breezeblocks","Tessellate"],"debut_year":2007,"genre":["Indie/Alternative"],"decades":["2010s"],"country":"United Kingdom"},{"name":"Of Monsters and Men","songs":["Little Talks","King of Anything","Mountain Sound"],"debut_year":2010,"genre":["Indie/Alternative"],"decades":["2010s"],"country":"Iceland"},{"name":"Cage the Elephant","songs":["Shake Me Down","Ain't No Rest for the Wicked","Come a Little Closer"],"debut_year":2006,"genre":["Rock","Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States"},{"name":"MGMT","songs":["Kids","Electric Feel","Time to Pretend"],"debut_year":2002,"genre":["Indie/Alternative","Electronic"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Zedd","songs":["Stay the Night","Beautiful Now","The Middle"],"debut_year":2012,"genre":["Electronic","Pop"],"decades":["2010s"],"country":"Germany"},{"name":"David Guetta","songs":["Titanium","When Love Takes Over","Without You"],"debut_year":2002,"genre":["Electronic","Pop"],"decades":["2000s","2010s"],"country":"France"},{"name":"Tiësto","songs":["The Business","Red Lights","Adagio for Strings"],"debut_year":1994,"genre":["Electronic"],"decades":["2000s","2010s","2020s"],"country":"Netherlands"},{"name":"The National","songs":["Bloodbuzz Ohio","Mr. November","Fake Empire"],"debut_year":1999,"genre":["Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Lewis Capaldi","songs":["Someone You Loved","Before You Go","Bruises"],"debut_year":2017,"genre":["Pop"],"decades":["2010s","2020s"],"country":"United Kingdom"},{"name":"Lizzo","songs":["Truth Hurts","Good as Hell","About Damn Time"],"debut_year":2012,"genre":["Pop","R&B/Soul"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Camila Cabello","songs":["Havana","Señorita","Never Be the Same"],"debut_year":2016,"genre":["Pop","Latin"],"decades":["2010s","2020s"],"country":"Cuba"},{"name":"Megan Thee Stallion","songs":["Savage","Hot Girl Summer","WAP"],"debut_year":2016,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States"},{"name":"The Script","songs":["The Man Who Can't Be Moved","Breakeven","Hall of Fame"],"debut_year":2007,"genre":["Pop","Rock"],"decades":["2000s","2010s"],"country":"Ireland"},{"name":"Passenger","songs":["Let Her Go","Things That Stop You Dreaming","Scare Away the Dark"],"debut_year":2003,"genre":["Indie/Alternative","Pop"],"decades":["2010s"],"country":"United Kingdom"},{"name":"Bon Iver","songs":["Skinny Love","Holocene","Towers"],"debut_year":2007,"genre":["Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Fleet Foxes","songs":["White Winter Hymnal","Helplessness Blues","Mykonos"],"debut_year":2006,"genre":["Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Pantera","songs":["Walk","Cowboys from Hell","Cemetery Gates"],"debut_year":1981,"genre":["Metal"],"decades":["80s","90s","2000s"],"country":"United States"},{"name":"System of a Down","songs":["Chop Suey!","B.Y.O.B.","Toxicity"],"debut_year":1994,"genre":["Metal","Rock"],"decades":["2000s"],"country":"United States"},{"name":"Tool","songs":["Schism","Sober","Forty Six & 2"],"debut_year":1990,"genre":["Metal","Rock"],"decades":["90s","2000s","2010s"],"country":"United States"},{"name":"Rammstein","songs":["Du Hast","Sonne","Feuer Frei!"],"debut_year":1994,"genre":["Metal","Rock"],"decades":["90s","2000s","2010s"],"country":"Germany"},{"name":"Korn","songs":["Freak on a Leash","Coming Undone","Here to Stay"],"debut_year":1993,"genre":["Metal","Rock"],"decades":["90s","2000s"],"country":"United States"},{"name":"Kraftwerk","songs":["Autobahn","Trans-Europe Express","The Model"],"debut_year":1969,"genre":["Electronic"],"decades":["70s","80s"],"country":"Germany"},{"name":"The Chemical Brothers","songs":["Block Rockin' Beats","Hey Boy Hey Girl","Galvanize"],"debut_year":1989,"genre":["Electronic"],"decades":["90s","2000s"],"country":"United Kingdom"},{"name":"The Prodigy","songs":["Firestarter","Breathe","Smack My Bitch Up"],"debut_year":1990,"genre":["Electronic","Rock"],"decades":["90s","2000s"],"country":"United Kingdom"},{"name":"Fatboy Slim","songs":["Praise You","Right Here, Right Now","Rockafeller Skank"],"debut_year":1996,"genre":["Electronic"],"decades":["90s","2000s"],"country":"United Kingdom"},{"name":"Moby","songs":["Porcelain","We Are All Made of Stars","Natural Blues"],"debut_year":1987,"genre":["Electronic"],"decades":["90s","2000s"],"country":"United States"},{"name":"Luke Combs","songs":["Beautiful Crazy","Beer Never Broke My Heart","Forever After All"],"debut_year":2014,"genre":["Country"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Zach Bryan","songs":["Something in the Orange","Heading South","I Remember Everything"],"debut_year":2019,"genre":["Country"],"decades":["2020s"],"country":"United States"},{"name":"Carrie Underwood","songs":["Before He Cheats","Blown Away","Jesus, Take the Wheel"],"debut_year":2005,"genre":["Country","Pop"],"decades":["2000s","2010s","2020s"],"country":"United States"},{"name":"Kenny Rogers","songs":["The Gambler","Lady","Islands in the Stream"],"debut_year":1958,"genre":["Country"],"decades":["70s","80s"],"country":"United States"},{"name":"Tim McGraw","songs":["Live Like You Were Dying","It's Your Love","Something Like That"],"debut_year":1993,"genre":["Country"],"decades":["90s","2000s","2010s"],"country":"United States"},{"name":"Brad Paisley","songs":["Online","Alcohol","Then"],"debut_year":1999,"genre":["Country"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Blake Shelton","songs":["God's Country","Austin","Ol' Red"],"debut_year":2001,"genre":["Country"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Luke Bryan","songs":["This Is How We Roll","Country Girl (Shake It for Me)","Do I"],"debut_year":2004,"genre":["Country"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Keith Urban","songs":["Blue Ain't Your Color","Better Life","Somebody Like You"],"debut_year":1991,"genre":["Country","Pop"],"decades":["2000s","2010s"],"country":"Australia"},{"name":"Alan Jackson","songs":["Chattahoochee","Remember When","It's Five O'Clock Somewhere"],"debut_year":1989,"genre":["Country"],"decades":["90s","2000s"],"country":"United States"},{"name":"Daddy Yankee","songs":["Gasolina","Con Calma","Despacito"],"debut_year":1994,"genre":["Latin"],"decades":["2000s","2010s","2020s"],"country":"Puerto Rico"},{"name":"Karol G","songs":["Tusa","Bichota","Provenza"],"debut_year":2012,"genre":["Latin"],"decades":["2010s","2020s"],"country":"Colombia"},{"name":"Peso Pluma","songs":["Ella Baila Sola","La Bebe","Chanel"],"debut_year":2020,"genre":["Latin"],"decades":["2020s"],"country":"Mexico"},{"name":"Marc Anthony","songs":["Vivir Mi Vida","I Need to Know","Valió la Pena"],"debut_year":1988,"genre":["Latin","R&B/Soul"],"decades":["90s","2000s","2010s"],"country":"United States"},{"name":"Ricky Martin","songs":["Livin' la Vida Loca","She Bangs","Shake Your Bon-Bon"],"debut_year":1984,"genre":["Latin","Pop"],"decades":["90s","2000s"],"country":"Puerto Rico"},{"name":"Pitbull","songs":["Give Me Everything","Feel This Moment","International Love"],"debut_year":2001,"genre":["Latin","Pop","Hip-Hop/Rap"],"decades":["2000s","2010s"],"country":"United States"},{"name":"Maluma","songs":["Hawái","Felices los 4","ADMV"],"debut_year":2011,"genre":["Latin"],"decades":["2010s","2020s"],"country":"Colombia"},{"name":"Lil Baby","songs":["Woah","The Bigger Picture","Sum 2 Prove"],"debut_year":2017,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Juice WRLD","songs":["Lucid Dreams","Legends","All Girls Are the Same"],"debut_year":2018,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Jack Harlow","songs":["What's Poppin","INDUSTRY BABY","Churchill Downs"],"debut_year":2018,"genre":["Hip-Hop/Rap"],"decades":["2020s"],"country":"United States"},{"name":"Giveon","songs":["Heartbreak Anniversary","For Tonight","Favorite Mistake"],"debut_year":2019,"genre":["R&B/Soul"],"decades":["2020s"],"country":"United States"},{"name":"Noah Kahan","songs":["Stick Season","Dial Drunk","She Calls Me Back"],"debut_year":2019,"genre":["Indie/Alternative","Pop"],"decades":["2020s"],"country":"United States"},{"name":"Benson Boone","songs":["Beautiful Things","Ghost Town","In the Stars"],"debut_year":2022,"genre":["Pop","Rock"],"decades":["2020s"],"country":"United States"},{"name":"Rod Wave","songs":["Heart on Ice","Richer","Girl of My Dreams"],"debut_year":2018,"genre":["Hip-Hop/Rap","R&B/Soul"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Gunna","songs":["Dollaz on My Head","Baby Birkin","Pushin P"],"debut_year":2016,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Polo G","songs":["Pop Out","Rapstar","Martin & Gina"],"debut_year":2018,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States"},{"name":"Feid","songs":["Feliz Cumpleaños Ferxxo","Normal","Hey Mor"],"debut_year":2014,"genre":["Latin"],"decades":["2010s","2020s"],"country":"Colombia"},{"name":"Rauw Alejandro","songs":["Todo de Ti","Cúrame","Tattoo"],"debut_year":2017,"genre":["Latin"],"decades":["2020s"],"country":"Puerto Rico"}];

/* ---------- Utilities ---------- */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ---------- Init ---------- */
function init() {
  const seen = new Set();
  state.allArtists = ARTISTS_DATA.filter(a => {
    if (seen.has(a.name)) return false;
    seen.add(a.name);
    return true;
  });
  setupEventListeners();
  showScreen('menu');
}

/* ---------- Screens ---------- */
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${name}`).classList.add('active');
  if (name === 'menu')     renderMenuScreen();
  if (name === 'category') renderCategoryScreen();
}

/* ---------- Menu Screen ---------- */
function renderMenuScreen() {
  const { wins, losses } = state.score;
  const scoreEl = document.getElementById('menu-score');
  if (wins + losses > 0) {
    document.getElementById('menu-wins').textContent   = wins;
    document.getElementById('menu-losses').textContent = losses;
    document.getElementById('menu-streak').textContent = state.streak;
    scoreEl.style.display = 'block';
  }
  updateDiffInfo();
}

function updateDiffInfo() {
  document.getElementById('diff-info').textContent = DIFFICULTY_CONFIG[state.difficulty].label;
}

/* ---------- Category Screen ---------- */
function renderCategoryScreen() {
  const decades = ['60s','70s','80s','90s','2000s','2010s','2020s'];
  const genres  = ['Rock','Pop','Hip-Hop/Rap','R&B/Soul','Electronic','Country','Metal','Indie/Alternative','Latin'];

  const decadeGrid = document.getElementById('decade-grid');
  const genreGrid  = document.getElementById('genre-grid');
  decadeGrid.innerHTML = '';
  genreGrid.innerHTML  = '';

  decades.forEach(d => {
    const count = getArtists('decade', d).length;
    decadeGrid.appendChild(makeCategoryBtn(d, count, () => startPack('decade', d)));
  });

  genres.forEach(g => {
    const count = getArtists('genre', g).length;
    genreGrid.appendChild(makeCategoryBtn(g, count, () => startPack('genre', g)));
  });
}

function makeCategoryBtn(label, count, onClick) {
  const btn = document.createElement('button');
  btn.className = 'category-btn';
  btn.innerHTML = `<span class="cat-name">${label}</span><span class="cat-count">${count} artist${count !== 1 ? 's' : ''}</span>`;
  btn.addEventListener('click', onClick);
  return btn;
}

/* ---------- Artist Filtering ---------- */
function getArtists(type, value) {
  if (type === 'random') return state.allArtists;
  if (type === 'decade') return state.allArtists.filter(a => a.decades.includes(value));
  if (type === 'genre')  return state.allArtists.filter(a =>
    a.genre.some(g => g.toLowerCase() === value.toLowerCase())
  );
  return state.allArtists;
}

/* ---------- Pack: Start ---------- */
function startPack(type, value) {
  state.categoryType    = type;
  state.currentCategory = value;
  state.score           = { wins: 0, losses: 0 };
  state.streak          = 0;

  let pool = getArtists(type, value);
  if (pool.length === 0) { alert('No artists in this category!'); return; }

  // Random = 20 shuffled from whole pool
  if (type === 'random') {
    pool = shuffle([...pool]).slice(0, 20);
  } else {
    pool = shuffle([...pool]);
  }

  pack.artists = pool;
  pack.index   = 0;
  pack.active  = true;
  pack.stats   = { correct: 0, guessesOnWins: 0, longestStreak: 0, currentStreak: 0 };

  startPackRound();
}

/* ---------- Pack: Start a single round ---------- */
function startPackRound() {
  const artist = pack.artists[pack.index];
  const cfg    = DIFFICULTY_CONFIG[state.difficulty];

  state.currentArtist    = artist;
  state.maxGuesses       = cfg.guesses;
  state.guessesRemaining = cfg.guesses;
  state.songsShown       = cfg.songs;
  state.hintsRevealed    = 0;
  state.revealedSongs    = new Set();
  state.songRevealedPos  = [new Set(), new Set(), new Set()];
  state.gameOver         = false;
  state.won              = false;

  buildGameScreen();
  showScreen('game');
}

/* ---------- Build Game Screen ---------- */
function buildGameScreen() {
  // Category tag
  document.getElementById('game-category-tag').textContent = state.currentCategory || 'Random';

  // Show/hide 3rd song row
  document.getElementById('song-row-2').style.display = state.songsShown >= 3 ? '' : 'none';

  // Pack progress bar
  const packProg = document.getElementById('pack-progress');
  if (pack.active) {
    packProg.style.display = '';
    updatePackProgress();
    document.getElementById('btn-quit-pack').style.display = '';
  } else {
    packProg.style.display = 'none';
    document.getElementById('btn-quit-pack').style.display = 'none';
  }

  // Clear feedback & inputs
  const fb = document.getElementById('feedback');
  fb.className = 'feedback';
  fb.textContent = '';
  document.getElementById('guess-input').value = '';
  document.getElementById('song-guess-input').value = '';

  renderArtistBlank();
  for (let i = 0; i < state.songsShown; i++) renderSongBlank(i);
  updateGuessCounter();
  renderHints();
}

/* ---------- Pack: Progress Bar ---------- */
function updatePackProgress() {
  const total   = pack.artists.length;
  const current = pack.index + 1;
  const pct     = (pack.index / total) * 100;

  document.getElementById('pack-progress-text').textContent = `Artist ${current} / ${total}`;
  document.getElementById('pack-progress-fill').style.width = `${pct}%`;
  document.getElementById('pack-score-display').innerHTML =
    `✓ ${pack.stats.correct} &nbsp;✗ ${pack.index - pack.stats.correct}`;
}

/* ---------- Character Helpers ---------- */
function charType(ch) {
  if (/[a-zA-Z]/.test(ch)) return 'letter';
  if (ch === ' ')           return 'space';
  return 'punct';
}

function makeCharEl(ch, type, revealed, newlyRevealed) {
  const el = document.createElement('span');
  if (type === 'letter') {
    const cls = ['char', 'letter', revealed ? 'revealed' : 'unrevealed'];
    if (newlyRevealed) cls.push('newly-revealed');
    el.className = cls.join(' ');
    el.textContent = revealed ? ch.toUpperCase() : '_';
  } else if (type === 'punct') {
    el.className = 'char punct';
    el.textContent = ch;
  }
  return el;
}

function renderTextAsBlank(text, revealedPositions, fullyRevealed, container) {
  container.innerHTML = '';
  let wordEl = null;

  for (let i = 0; i < text.length; i++) {
    const ch   = text[i];
    const type = charType(ch);

    if (type === 'space') {
      if (wordEl) { container.appendChild(wordEl); wordEl = null; }
      const gap = document.createElement('span');
      gap.className = 'word-gap';
      container.appendChild(gap);
      continue;
    }

    if (!wordEl) {
      wordEl = document.createElement('span');
      wordEl.className = 'word-group';
    }

    const revealed = fullyRevealed || (type === 'letter' && revealedPositions.has(i));
    wordEl.appendChild(makeCharEl(ch, type, revealed, false));
  }
  if (wordEl) container.appendChild(wordEl);
}

/* ---------- Render Artist Blank ---------- */
function renderArtistBlank(fullyReveal = false) {
  const container = document.getElementById('artist-name-blank');
  renderTextAsBlank(state.currentArtist.name, new Set(), fullyReveal, container);
}

/* ---------- Render Song Blank ---------- */
function renderSongBlank(idx, highlightNewPositions = null) {
  const song      = state.currentArtist.songs[idx];
  const container = document.getElementById(`song-${idx}`);
  const fullyRevealed = state.revealedSongs.has(idx);
  const positions = state.songRevealedPos[idx];

  container.innerHTML = '';
  container.className = `song-blank${fullyRevealed ? ' fully-revealed' : ''}`;

  let wordEl = null;
  for (let i = 0; i < song.length; i++) {
    const ch   = song[i];
    const type = charType(ch);

    if (type === 'space') {
      if (wordEl) { container.appendChild(wordEl); wordEl = null; }
      const gap = document.createElement('span');
      gap.className = 'word-gap';
      container.appendChild(gap);
      continue;
    }

    if (!wordEl) {
      wordEl = document.createElement('span');
      wordEl.className = 'word-group';
    }

    const revealed     = fullyRevealed || (type === 'letter' && positions.has(i));
    const isNew        = highlightNewPositions && highlightNewPositions.has(i);
    wordEl.appendChild(makeCharEl(ch, type, revealed, isNew));
  }
  if (wordEl) container.appendChild(wordEl);
}

/* ---------- Guess Counter ---------- */
function updateGuessCounter() {
  const container = document.getElementById('guess-counter');
  container.innerHTML = '';
  for (let i = 0; i < state.maxGuesses; i++) {
    const icon = document.createElement('span');
    icon.className = `guess-icon ${i < state.guessesRemaining ? 'active' : 'used'}`;
    icon.textContent = '♪';
    container.appendChild(icon);
  }
  const s = state.guessesRemaining !== 1 ? 'es' : '';
  document.getElementById('guess-count-text').textContent =
    `${state.guessesRemaining} guess${s} remaining`;
}

/* ---------- Hints ---------- */
const HINT_MESSAGES = [
  () => `<strong>Hint 1:</strong> A letter has been revealed in each song title`,
  () => `<strong>Debut Year:</strong> ${state.currentArtist.debut_year}`,
  () => `<strong>Genre:</strong> ${state.currentArtist.genre.join(' / ')}`,
  () => `<strong>Country:</strong> ${state.currentArtist.country} &nbsp;+&nbsp; more letters revealed`,
];

function renderHints() {
  const list = document.getElementById('hints-list');
  document.getElementById('hints-count').textContent = `${state.hintsRevealed} / 4`;

  if (state.hintsRevealed === 0) {
    list.innerHTML = '<p class="no-hints">Make a wrong artist guess to unlock hints…</p>';
    return;
  }

  list.innerHTML = '';
  for (let i = 0; i < state.hintsRevealed; i++) {
    const item = document.createElement('div');
    item.className = `hint-item${i === state.hintsRevealed - 1 ? ' animate-in' : ''}`;
    item.innerHTML = `<span style="color:var(--amber)">●</span> ${HINT_MESSAGES[i]()}`;
    list.appendChild(item);
  }
}

/* ---------- Letter Revelation ---------- */
const CONSONANTS = new Set('bcdfghjklmnpqrstvwxyz');

function pickRevealPosition(song, revealedPositions) {
  const letters = [];
  for (let i = 0; i < song.length; i++) {
    if (/[a-zA-Z]/.test(song[i]) && !revealedPositions.has(i)) letters.push(i);
  }
  if (letters.length === 0) return -1;

  // Prefer consonants for better gameplay feel
  const consonantPositions = letters.filter(i => CONSONANTS.has(song[i].toLowerCase()));
  const pool = consonantPositions.length > 0 ? consonantPositions : letters;
  return pool[Math.floor(Math.random() * pool.length)];
}

function revealLetterInAllSongs() {
  for (let i = 0; i < state.songsShown; i++) {
    if (state.revealedSongs.has(i)) continue;
    const pos = pickRevealPosition(state.currentArtist.songs[i], state.songRevealedPos[i]);
    if (pos !== -1) {
      state.songRevealedPos[i].add(pos);
      renderSongBlank(i, new Set([pos]));
      // Brief highlight animation
      const song = state.currentArtist.songs[i];
      setTimeout(() => renderSongBlank(i), 400);
    }
  }
}

/* ---------- Fuzzy Matching ---------- */
function normalize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/^the\s+/i, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function fuzzyMatch(guess, answer, aliases) {
  const g = normalize(guess);
  if (g === normalize(answer)) return true;
  for (const alias of (aliases || [])) {
    if (g === normalize(alias)) return true;
  }
  return false;
}

function songMatch(guess, song) {
  return normalize(guess) === normalize(song);
}

/* ---------- Handle Artist Guess ---------- */
function handleArtistGuess() {
  if (state.gameOver) return;
  const input = document.getElementById('guess-input');
  const guess = input.value.trim();
  if (!guess) return;
  input.value = '';

  const { currentArtist } = state;

  if (fuzzyMatch(guess, currentArtist.name, currentArtist.aliases)) {
    onWin();
  } else {
    onWrongArtistGuess();
  }
}

function onWin() {
  state.gameOver = true;
  state.won      = true;
  state.score.wins++;
  state.streak++;

  if (pack.active) {
    pack.stats.correct++;
    pack.stats.currentStreak++;
    pack.stats.guessesOnWins += (state.maxGuesses - state.guessesRemaining + 1);
    if (pack.stats.currentStreak > pack.stats.longestStreak)
      pack.stats.longestStreak = pack.stats.currentStreak;
  }

  showFeedback('🎉 Correct!', 'correct');
  flashCard('flash-win');
  renderArtistBlank(true);
  for (let i = 0; i < state.songsShown; i++) {
    state.revealedSongs.add(i);
    renderSongBlank(i);
  }
  setTimeout(() => showResultScreen(), 1200);
}

function onWrongArtistGuess() {
  state.guessesRemaining--;
  const wrongNum = state.maxGuesses - state.guessesRemaining;

  if (wrongNum === 1 || wrongNum === 4) revealLetterInAllSongs();
  if (wrongNum <= 4) state.hintsRevealed = wrongNum;

  showFeedback('Wrong — try again!', 'wrong');
  flashCard('shake');
  flashCard('flash-wrong');
  updateGuessCounter();
  renderHints();

  if (state.guessesRemaining <= 0) onLose();
}

function onLose() {
  state.gameOver = true;
  state.won      = false;
  state.score.losses++;
  state.streak   = 0;

  if (pack.active) pack.stats.currentStreak = 0;

  showFeedback('Game over!', 'wrong');
  renderArtistBlank(true);
  for (let i = 0; i < state.songsShown; i++) {
    state.revealedSongs.add(i);
    renderSongBlank(i);
  }
  setTimeout(() => showResultScreen(), 1400);
}

/* ---------- Handle Song Guess ---------- */
function handleSongGuess() {
  if (state.gameOver) return;
  const input = document.getElementById('song-guess-input');
  const guess = input.value.trim();
  if (!guess) return;
  input.value = '';

  const { currentArtist, songsShown } = state;
  let matched = false;

  for (let i = 0; i < songsShown; i++) {
    if (!state.revealedSongs.has(i) && songMatch(guess, currentArtist.songs[i])) {
      state.revealedSongs.add(i);
      renderSongBlank(i);
      const el = document.getElementById(`song-${i}`);
      el.classList.add('song-revealed-anim');
      setTimeout(() => el.classList.remove('song-revealed-anim'), 700);
      showFeedback('🎵 Song revealed!', 'correct');
      matched = true;
      break;
    }
  }

  if (!matched) {
    showFeedback('Not a match — no penalty though!', 'info');
  }
}

/* ---------- Give Up / Quit Pack ---------- */
function giveUp() {
  if (state.gameOver) return;
  onLose();
}

function quitPack() {
  if (!pack.active) return;
  // Record current artist as a loss if round is still in progress
  if (!state.gameOver) {
    state.gameOver = true;
    state.won      = false;
    state.score.losses++;
    pack.stats.currentStreak = 0;
    renderArtistBlank(true);
    for (let i = 0; i < state.songsShown; i++) {
      state.revealedSongs.add(i);
      renderSongBlank(i);
    }
  }
  pack.index++; // count current artist as done
  showPackSummary();
}

/* ---------- Animations / Feedback ---------- */
function flashCard(cls) {
  const card = document.getElementById('game-card');
  card.classList.add(cls);
  setTimeout(() => card.classList.remove(cls), 500);
}

let feedbackTimer;
function showFeedback(msg, type) {
  clearTimeout(feedbackTimer);
  const el = document.getElementById('feedback');
  el.textContent = msg;
  el.className   = `feedback ${type} visible`;
  feedbackTimer = setTimeout(() => el.classList.remove('visible'), 2200);
}

/* ---------- Result Screen ---------- */
let countdownTimer = null;

function showResultScreen() {
  clearCountdown();

  const { won, currentArtist, maxGuesses, guessesRemaining, score, streak } = state;
  const guessesUsed = maxGuesses - guessesRemaining + (won ? 1 : 0);
  const isLastArtist = pack.active && pack.index >= pack.artists.length - 1;

  document.getElementById('result-icon').textContent   = won ? '🎉' : '😔';
  document.getElementById('result-title').textContent  = won ? 'You Got It!' : 'Better Luck Next Time!';
  document.getElementById('result-artist').textContent = currentArtist.name;

  document.getElementById('result-songs').innerHTML = currentArtist.songs
    .slice(0, state.songsShown).map(s => `<li>${s}</li>`).join('');

  document.getElementById('result-stat').textContent = won
    ? `Guessed in ${guessesUsed} guess${guessesUsed !== 1 ? 'es' : ''}`
    : 'The artist was revealed';

  document.getElementById('result-score').textContent =
    `Score: ${score.wins}W / ${score.losses}L  ·  🔥 Streak: ${streak}`;

  // Button visibility
  const btnNext    = document.getElementById('btn-next-artist');
  const btnSummary = document.getElementById('btn-pack-summary');
  const btnAgain   = document.getElementById('btn-play-again');

  if (pack.active && !isLastArtist) {
    btnNext.style.display    = '';
    btnSummary.style.display = 'none';
    btnAgain.style.display   = 'none';
  } else if (pack.active && isLastArtist) {
    btnNext.style.display    = 'none';
    btnSummary.style.display = '';
    btnAgain.style.display   = 'none';
  } else {
    btnNext.style.display    = 'none';
    btnSummary.style.display = 'none';
    btnAgain.style.display   = '';
  }

  // Pack progress badge
  const badge = document.getElementById('pack-result-badge');
  if (pack.active) {
    badge.style.display = '';
    document.getElementById('pack-result-progress').textContent =
      `Artist ${pack.index + 1} / ${pack.artists.length}`;
    document.getElementById('pack-result-score').textContent =
      `✓ ${pack.stats.correct}  ✗ ${(pack.index + 1) - pack.stats.correct - (won ? 0 : 0)}`;
  } else {
    badge.style.display = 'none';
  }

  showScreen('result');

  // Auto-advance countdown (3 s) for mid-pack rounds
  if (pack.active && !isLastArtist) startCountdown(3, advancePackRound);
}

function startCountdown(seconds, callback) {
  const bar   = document.getElementById('countdown-bar');
  const fill  = document.getElementById('countdown-fill');
  const label = document.getElementById('countdown-label');

  bar.style.display = '';
  let remaining = seconds;

  label.textContent = `(${remaining})`;
  fill.style.transition = 'none';
  fill.style.width = '100%';

  // Force reflow then animate
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fill.style.transition = `width ${seconds}s linear`;
      fill.style.width = '0%';
    });
  });

  countdownTimer = setInterval(() => {
    remaining--;
    label.textContent = remaining > 0 ? `(${remaining})` : '';
    if (remaining <= 0) {
      clearCountdown();
      callback();
    }
  }, 1000);
}

function clearCountdown() {
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
  const bar = document.getElementById('countdown-bar');
  if (bar) bar.style.display = 'none';
  const label = document.getElementById('countdown-label');
  if (label) label.textContent = '';
}

/* ---------- Pack: Advance / Summary ---------- */
function advancePackRound() {
  clearCountdown();
  pack.index++;
  if (pack.index >= pack.artists.length) {
    showPackSummary();
  } else {
    startPackRound();
  }
}

function calcGrade(pct) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
}

function showPackSummary() {
  clearCountdown();
  pack.active = false;

  const total   = pack.index; // artists played
  const correct = pack.stats.correct;
  const pct     = total > 0 ? Math.round((correct / total) * 100) : 0;
  const avg     = correct > 0 ? (pack.stats.guessesOnWins / correct).toFixed(1) : '—';
  const grade   = calcGrade(pct);

  document.getElementById('summary-grade').textContent    = grade;
  document.getElementById('summary-correct').textContent  = `${correct} / ${total}`;
  document.getElementById('summary-pct').textContent      = `${pct}%`;
  document.getElementById('summary-avg').textContent      = avg;
  document.getElementById('summary-streak').textContent   = pack.stats.longestStreak;
  document.getElementById('summary-category').textContent =
    (state.currentCategory || 'Random') + ' · ' + total + ' artist' + (total !== 1 ? 's' : '');

  showScreen('pack-summary');
}

/* ---------- Event Listeners ---------- */
function setupEventListeners() {
  // Menu
  document.getElementById('btn-start').addEventListener('click', () => showScreen('category'));

  // Difficulty
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.difficulty = btn.dataset.difficulty;
      updateDiffInfo();
    });
  });

  // Category
  document.getElementById('btn-category-back').addEventListener('click', () => showScreen('menu'));
  document.getElementById('btn-random').addEventListener('click', () => startPack('random', null));

  // Game — artist guess
  document.getElementById('btn-guess-artist').addEventListener('click', handleArtistGuess);
  document.getElementById('guess-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleArtistGuess();
    if (e.key === 'Tab') { e.preventDefault(); document.getElementById('song-guess-input').focus(); }
  });

  // Game — song guess
  document.getElementById('btn-guess-song').addEventListener('click', handleSongGuess);
  document.getElementById('song-guess-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSongGuess();
    if (e.key === 'Tab') { e.preventDefault(); document.getElementById('guess-input').focus(); }
  });

  // Game — give up
  document.getElementById('btn-give-up').addEventListener('click', () => {
    if (!state.gameOver && confirm('Are you sure you want to give up?')) giveUp();
  });

  // Game — quit pack
  document.getElementById('btn-quit-pack').addEventListener('click', () => {
    if (confirm('Quit pack? Your results so far will be shown.')) quitPack();
  });

  // Game — back to menu/category
  document.getElementById('btn-game-menu').addEventListener('click', () => {
    const msg = pack.active
      ? 'Return to menu? Your pack progress will be lost.'
      : 'Return to menu? Your progress will be lost.';
    if (state.gameOver || confirm(msg)) {
      clearCountdown();
      pack.active = false;
      showScreen('category');
    }
  });

  // Result — next artist (mid-pack)
  document.getElementById('btn-next-artist').addEventListener('click', () => advancePackRound());

  // Result — view pack summary (last artist)
  document.getElementById('btn-pack-summary').addEventListener('click', () => {
    pack.index++;
    showPackSummary();
  });

  // Result — play again (single-play)
  document.getElementById('btn-play-again').addEventListener('click', () =>
    startPack(state.categoryType, state.currentCategory)
  );

  // Result — change category / main menu
  document.getElementById('btn-change-category').addEventListener('click', () => {
    clearCountdown(); pack.active = false; showScreen('category');
  });
  document.getElementById('btn-main-menu').addEventListener('click', () => {
    clearCountdown(); pack.active = false; showScreen('menu');
  });

  // Pack summary buttons
  document.getElementById('btn-replay-pack').addEventListener('click', () =>
    startPack(state.categoryType, state.currentCategory)
  );
  document.getElementById('btn-summary-new-category').addEventListener('click', () =>
    showScreen('category')
  );
  document.getElementById('btn-summary-menu').addEventListener('click', () =>
    showScreen('menu')
  );
}

/* ---------- Boot ---------- */
init();
