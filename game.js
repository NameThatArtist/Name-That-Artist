/* ============================================================
   Name That Artist — Game Logic
   ============================================================ */

/* ---------- Embedded artist data (avoids fetch() restrictions on file://) ---------- */
/* To update: edit artists.json, then run: node build-game.js */
const ARTISTS_DATA = [{"name":"The Beatles","songs":["Come Together","Hey Jude","Let It Be"],"debut_year":1960,"genre":["Rock"],"decades":["60s","70s"],"country":"United Kingdom","aliases":["Beatles"],"members":4,"difficulty":"easy","fun_fact":"The Beatles hold the record for the most number-one hits on the US Billboard Hot 100 with 20.","spotify_ids":[]},{"name":"The Rolling Stones","songs":["Paint It Black","(I Can't Get No) Satisfaction","Sympathy for the Devil"],"debut_year":1962,"genre":["Rock"],"decades":["60s","70s","80s","90s","2000s","2010s"],"country":"United Kingdom","aliases":["Rolling Stones"],"members":1,"difficulty":"easy","fun_fact":"Despite being in their 80s, The Rolling Stones continue to sell out stadiums worldwide.","spotify_ids":[]},{"name":"Led Zeppelin","songs":["Stairway to Heaven","Whole Lotta Love","Kashmir"],"debut_year":1968,"genre":["Rock","Metal"],"decades":["70s"],"country":"United Kingdom","members":4,"difficulty":"easy","fun_fact":"Stairway to Heaven was never released as a single, yet became the most-requested song in radio history.","spotify_ids":[]},{"name":"Jimi Hendrix","songs":["Purple Haze","All Along the Watchtower","Voodoo Child (Slight Return)"],"debut_year":1966,"genre":["Rock"],"decades":["60s"],"country":"United States","aliases":["Hendrix"],"members":1,"difficulty":"easy","spotify_ids":[]},{"name":"The Doors","songs":["Light My Fire","Riders on the Storm","People Are Strange"],"debut_year":1965,"genre":["Rock"],"decades":["60s","70s"],"country":"United States","aliases":["Doors"],"members":4,"difficulty":"easy","spotify_ids":[]},{"name":"Pink Floyd","songs":["Comfortably Numb","Wish You Were Here","Another Brick in the Wall, Pt. 2"],"debut_year":1965,"genre":["Rock"],"decades":["70s","80s"],"country":"United Kingdom","members":4,"difficulty":"easy","fun_fact":"The Dark Side of the Moon spent an astonishing 937 weeks on the Billboard 200 chart.","spotify_ids":[]},{"name":"Queen","songs":["Bohemian Rhapsody","Don't Stop Me Now","Somebody to Love"],"debut_year":1970,"genre":["Rock"],"decades":["70s","80s"],"country":"United Kingdom","members":4,"difficulty":"easy","fun_fact":"Bohemian Rhapsody was considered too long for radio play but became one of the best-selling singles of all time.","spotify_ids":[]},{"name":"David Bowie","songs":["Heroes","Space Oddity","Let's Dance"],"debut_year":1964,"genre":["Rock","Pop"],"decades":["70s","80s","90s","2000s"],"country":"United Kingdom","aliases":["Ziggy Stardust"],"members":1,"difficulty":"easy","fun_fact":"Bowie had two different-colored eyes from a schoolyard fight at age 15 that permanently dilated his left pupil.","spotify_ids":[]},{"name":"Fleetwood Mac","songs":["Dreams","Go Your Own Way","The Chain"],"debut_year":1967,"genre":["Rock"],"decades":["70s","80s"],"country":"United Kingdom","members":5,"difficulty":"medium","fun_fact":"Rumours was recorded while all four core members were simultaneously going through breakups with each other.","spotify_ids":[]},{"name":"Eagles","songs":["Hotel California","Take It Easy","Desperado"],"debut_year":1971,"genre":["Rock","Country"],"decades":["70s","80s","90s"],"country":"United States","aliases":["The Eagles"],"members":5,"difficulty":"easy","fun_fact":"Hotel California's iconic dual guitar solo was reportedly performed live on the very first take.","spotify_ids":[]},{"name":"Elton John","songs":["Rocket Man","Tiny Dancer","Crocodile Rock"],"debut_year":1964,"genre":["Pop","Rock"],"decades":["70s","80s","90s","2000s"],"country":"United Kingdom","members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Bruce Springsteen","songs":["Born to Run","Born in the U.S.A.","Dancing in the Dark"],"debut_year":1972,"genre":["Rock"],"decades":["80s","90s"],"country":"United States","aliases":["The Boss"],"members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Tom Petty","songs":["Free Fallin'","I Won't Back Down","American Girl"],"debut_year":1976,"genre":["Rock"],"decades":["80s","90s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"The Police","songs":["Every Breath You Take","Roxanne","Don't Stand So Close to Me"],"debut_year":1977,"genre":["Rock"],"decades":["80s"],"country":"United Kingdom","aliases":["Police"],"members":3,"difficulty":"medium","spotify_ids":[]},{"name":"Bon Jovi","songs":["Livin' on a Prayer","It's My Life","Wanted Dead or Alive"],"debut_year":1983,"genre":["Rock"],"decades":["80s","90s","2000s"],"country":"United States","members":5,"difficulty":"easy","spotify_ids":[]},{"name":"U2","songs":["With or Without You","One","Where the Streets Have No Name"],"debut_year":1976,"genre":["Rock"],"decades":["80s","90s","2000s","2010s"],"country":"Ireland","members":4,"difficulty":"easy","fun_fact":"Bono is the only person ever nominated for a Grammy, Oscar, Golden Globe, and Nobel Peace Prize.","spotify_ids":[]},{"name":"AC/DC","songs":["Back in Black","Highway to Hell","Thunderstruck"],"debut_year":1973,"genre":["Rock","Metal"],"decades":["80s","90s"],"country":"Australia","members":5,"difficulty":"easy","fun_fact":"AC/DC's Back in Black is the second best-selling album of all time, behind only Thriller.","spotify_ids":[]},{"name":"Bob Dylan","songs":["Blowin' in the Wind","Like a Rolling Stone","The Times They Are a-Changin'"],"debut_year":1962,"genre":["Rock"],"decades":["60s","70s","80s","90s"],"country":"United States","members":1,"difficulty":"easy","fun_fact":"Bob Dylan is the only rock musician to have won the Nobel Prize in Literature, awarded in 2016.","spotify_ids":[]},{"name":"Simon & Garfunkel","songs":["The Sound of Silence","Mrs. Robinson","Bridge Over Troubled Water"],"debut_year":1964,"genre":["Rock"],"decades":["60s","70s"],"country":"United States","aliases":["Simon and Garfunkel"],"members":2,"difficulty":"medium","spotify_ids":[]},{"name":"The Beach Boys","songs":["Good Vibrations","Surfin' USA","God Only Knows"],"debut_year":1961,"genre":["Rock","Pop"],"decades":["60s","70s"],"country":"United States","aliases":["Beach Boys"],"members":5,"difficulty":"medium","spotify_ids":[]},{"name":"Nirvana","songs":["Smells Like Teen Spirit","Come as You Are","Heart-Shaped Box"],"debut_year":1987,"genre":["Rock"],"decades":["90s"],"country":"United States","members":3,"difficulty":"easy","fun_fact":"Kurt Cobain was left-handed and played guitar left-handed, but wrote and drew right-handed.","spotify_ids":[]},{"name":"Oasis","songs":["Wonderwall","Don't Look Back in Anger","Champagne Supernova"],"debut_year":1991,"genre":["Rock"],"decades":["90s","2000s"],"country":"United Kingdom","members":1,"difficulty":"medium","fun_fact":"Liam and Noel Gallagher haven't spoken since their bitter on-stage split in Paris in 2009.","spotify_ids":[]},{"name":"Radiohead","songs":["Creep","Karma Police","No Surprises"],"debut_year":1985,"genre":["Indie/Alternative"],"decades":["90s","2000s","2010s"],"country":"United Kingdom","members":5,"difficulty":"medium","fun_fact":"Radiohead titled OK Computer after a hitchhiker's line in Douglas Adams' The Hitchhiker's Guide to the Galaxy.","spotify_ids":[]},{"name":"Green Day","songs":["Basket Case","American Idiot","Good Riddance (Time of Your Life)"],"debut_year":1987,"genre":["Rock"],"decades":["90s","2000s","2010s"],"country":"United States","members":3,"difficulty":"easy","fun_fact":"Green Day wrote American Idiot after their previous album's master recordings were stolen from a studio.","spotify_ids":[]},{"name":"Foo Fighters","songs":["Everlong","Learn to Fly","Best of You"],"debut_year":1994,"genre":["Rock"],"decades":["90s","2000s","2010s","2020s"],"country":"United States","members":6,"difficulty":"medium","fun_fact":"Dave Grohl played every single instrument on the Foo Fighters' entire debut album entirely by himself.","spotify_ids":[]},{"name":"Red Hot Chili Peppers","songs":["Under the Bridge","Californication","Give It Away"],"debut_year":1983,"genre":["Rock"],"decades":["90s","2000s"],"country":"United States","aliases":["RHCP"],"members":4,"difficulty":"easy","spotify_ids":[]},{"name":"Alanis Morissette","songs":["You Oughta Know","Ironic","Hand in My Pocket"],"debut_year":1991,"genre":["Rock","Indie/Alternative"],"decades":["90s","2000s"],"country":"Canada","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Arctic Monkeys","songs":["Do I Wanna Know?","R U Mine?","505"],"debut_year":2002,"genre":["Indie/Alternative","Rock"],"decades":["2000s","2010s","2020s"],"country":"United Kingdom","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Coldplay","songs":["Yellow","The Scientist","Fix You"],"debut_year":1996,"genre":["Indie/Alternative"],"decades":["2000s","2010s","2020s"],"country":"United Kingdom","members":4,"difficulty":"easy","fun_fact":"Coldplay was originally called Starfish before changing their name in 1998.","spotify_ids":[]},{"name":"Gorillaz","songs":["Feel Good Inc.","Clint Eastwood","DARE"],"debut_year":1998,"genre":["Indie/Alternative","Electronic"],"decades":["2000s","2010s","2020s"],"country":"United Kingdom","members":2,"difficulty":"medium","fun_fact":"Gorillaz holds the Guinness World Record as the most commercially successful virtual band of all time.","spotify_ids":[]},{"name":"Tame Impala","songs":["The Less I Know the Better","Let It Happen","Feels Like We Only Go Backwards"],"debut_year":2007,"genre":["Indie/Alternative"],"decades":["2010s","2020s"],"country":"Australia","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Lorde","songs":["Royals","Green Light","Tennis Court"],"debut_year":2013,"genre":["Indie/Alternative","Pop"],"decades":["2010s","2020s"],"country":"New Zealand","aliases":["Ella Yelich-O'Connor"],"members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Twenty One Pilots","songs":["Stressed Out","Ride","Heathens"],"debut_year":2009,"genre":["Indie/Alternative"],"decades":["2010s","2020s"],"country":"United States","members":2,"difficulty":"medium","spotify_ids":[]},{"name":"Imagine Dragons","songs":["Radioactive","Demons","Thunder"],"debut_year":2008,"genre":["Indie/Alternative","Rock"],"decades":["2010s","2020s"],"country":"United States","members":4,"difficulty":"medium","fun_fact":"Imagine Dragons is the most-streamed rock band in Spotify history.","spotify_ids":[]},{"name":"Lana Del Rey","songs":["Summertime Sadness","Video Games","Young and Beautiful"],"debut_year":2012,"genre":["Indie/Alternative","Pop"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Metallica","songs":["Enter Sandman","Master of Puppets","One"],"debut_year":1981,"genre":["Metal"],"decades":["80s","90s","2000s","2010s"],"country":"United States","members":4,"difficulty":"easy","fun_fact":"Metallica is the only band to have performed on all 7 continents, including a concert in Antarctica in 2013.","spotify_ids":[]},{"name":"Guns N' Roses","songs":["Sweet Child O' Mine","Welcome to the Jungle","November Rain"],"debut_year":1985,"genre":["Metal","Rock"],"decades":["80s","90s"],"country":"United States","aliases":["GNR","Guns and Roses"],"members":1,"difficulty":"easy","fun_fact":"Appetite for Destruction is the best-selling debut album of all time in the United States.","spotify_ids":[]},{"name":"Def Leppard","songs":["Pour Some Sugar on Me","Photograph","Love Bites"],"debut_year":1977,"genre":["Metal","Rock"],"decades":["80s","90s"],"country":"United Kingdom","members":5,"difficulty":"medium","spotify_ids":[]},{"name":"Linkin Park","songs":["In the End","Numb","Crawling"],"debut_year":1996,"genre":["Metal","Rock"],"decades":["2000s","2010s"],"country":"United States","members":6,"difficulty":"medium","fun_fact":"Linkin Park's debut Hybrid Theory was rejected by every major label before eventually being signed.","spotify_ids":[]},{"name":"Black Sabbath","songs":["Iron Man","War Pigs","Paranoid"],"debut_year":1968,"genre":["Metal","Rock"],"decades":["70s","80s"],"country":"United Kingdom","members":4,"difficulty":"medium","fun_fact":"Tony Iommi lost the fingertips of two fingers in a factory accident and learned to play anyway, defining heavy metal.","spotify_ids":[]},{"name":"Michael Jackson","songs":["Thriller","Billie Jean","Beat It"],"debut_year":1964,"genre":["Pop","R&B/Soul"],"decades":["80s","90s"],"country":"United States","aliases":["MJ","King of Pop"],"members":1,"difficulty":"easy","fun_fact":"Michael Jackson's Thriller is the best-selling album of all time with over 66 million copies sold.","spotify_ids":[]},{"name":"Madonna","songs":["Like a Virgin","Material Girl","Papa Don't Preach"],"debut_year":1979,"genre":["Pop"],"decades":["80s","90s","2000s"],"country":"United States","aliases":["Queen of Pop"],"members":1,"difficulty":"easy","fun_fact":"Madonna holds the record for the highest-grossing concert tour by a solo female artist.","spotify_ids":[]},{"name":"Prince","songs":["Purple Rain","When Doves Cry","Kiss"],"debut_year":1978,"genre":["Pop","R&B/Soul"],"decades":["80s","90s"],"country":"United States","members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Whitney Houston","songs":["I Will Always Love You","Greatest Love of All","I Wanna Dance with Somebody (Who Loves Me)"],"debut_year":1983,"genre":["Pop","R&B/Soul"],"decades":["80s","90s"],"country":"United States","members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Mariah Carey","songs":["All I Want for Christmas Is You","We Belong Together","Fantasy"],"debut_year":1990,"genre":["Pop","R&B/Soul"],"decades":["90s","2000s","2010s"],"country":"United States","members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Cyndi Lauper","songs":["Girls Just Want to Have Fun","Time After Time","True Colors"],"debut_year":1978,"genre":["Pop"],"decades":["80s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"George Michael","songs":["Careless Whisper","Faith","Father Figure"],"debut_year":1981,"genre":["Pop","R&B/Soul"],"decades":["80s","90s"],"country":"United Kingdom","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"ABBA","songs":["Dancing Queen","Mamma Mia","Waterloo"],"debut_year":1972,"genre":["Pop"],"decades":["70s"],"country":"Sweden","members":4,"difficulty":"easy","fun_fact":"ABBA was reportedly offered $1 billion to reunite for a world tour in 2000, but turned it down.","spotify_ids":[]},{"name":"Duran Duran","songs":["Hungry Like the Wolf","Rio","Girls on Film"],"debut_year":1978,"genre":["Pop","Rock"],"decades":["80s","90s"],"country":"United Kingdom","members":5,"difficulty":"medium","spotify_ids":[]},{"name":"Taylor Swift","songs":["Shake It Off","Blank Space","Anti-Hero"],"debut_year":2006,"genre":["Pop","Country"],"decades":["2000s","2010s","2020s"],"country":"United States","members":1,"difficulty":"easy","fun_fact":"Taylor Swift re-recorded her first 6 albums to reclaim full ownership of her masters after a dispute.","spotify_ids":[]},{"name":"Katy Perry","songs":["Roar","Firework","Teenage Dream"],"debut_year":2001,"genre":["Pop"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Lady Gaga","songs":["Bad Romance","Poker Face","Just Dance"],"debut_year":2008,"genre":["Pop","Electronic"],"decades":["2000s","2010s","2020s"],"country":"United States","members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Rihanna","songs":["Umbrella","We Found Love","Diamonds"],"debut_year":2003,"genre":["Pop","R&B/Soul"],"decades":["2000s","2010s","2020s"],"country":"Barbados","members":1,"difficulty":"easy","fun_fact":"Rihanna performed the Super Bowl LVII Halftime Show while reportedly pregnant with her second child.","spotify_ids":[]},{"name":"Justin Timberlake","songs":["SexyBack","Can't Stop the Feeling!","Mirrors"],"debut_year":2003,"genre":["Pop","R&B/Soul"],"decades":["2000s","2010s","2020s"],"country":"United States","aliases":["JT"],"members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Beyoncé","songs":["Crazy in Love","Irreplaceable","Single Ladies (Put a Ring on It)"],"debut_year":2003,"genre":["Pop","R&B/Soul"],"decades":["2000s","2010s","2020s"],"country":"United States","aliases":["Bey","Queen Bey"],"members":1,"difficulty":"easy","fun_fact":"Beyoncé became the most Grammy-awarded artist in history, surpassing 32 total wins.","spotify_ids":[]},{"name":"Adele","songs":["Rolling in the Deep","Someone Like You","Hello"],"debut_year":2006,"genre":["Pop","R&B/Soul"],"decades":["2000s","2010s","2020s"],"country":"United Kingdom","members":1,"difficulty":"easy","fun_fact":"Adele's album 21 was the best-selling album of both 2011 and 2012 worldwide.","spotify_ids":[]},{"name":"Ed Sheeran","songs":["Shape of You","Perfect","Thinking Out Loud"],"debut_year":2011,"genre":["Pop"],"decades":["2010s","2020s"],"country":"United Kingdom","members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Bruno Mars","songs":["Uptown Funk","Just the Way You Are","Locked Out of Heaven"],"debut_year":2009,"genre":["Pop","R&B/Soul"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Ariana Grande","songs":["Thank U, Next","7 Rings","Problem"],"debut_year":2011,"genre":["Pop","R&B/Soul"],"decades":["2010s","2020s"],"country":"United States","aliases":["Ari"],"members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Dua Lipa","songs":["Levitating","Don't Start Now","New Rules"],"debut_year":2015,"genre":["Pop","Electronic"],"decades":["2010s","2020s"],"country":"United Kingdom","members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Harry Styles","songs":["As It Was","Watermelon Sugar","Adore You"],"debut_year":2017,"genre":["Pop","Rock"],"decades":["2010s","2020s"],"country":"United Kingdom","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Billie Eilish","songs":["bad guy","Happier Than Ever","Ocean Eyes"],"debut_year":2016,"genre":["Pop","Indie/Alternative"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Olivia Rodrigo","songs":["drivers license","good 4 u","Vampire"],"debut_year":2021,"genre":["Pop","Indie/Alternative"],"decades":["2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Sabrina Carpenter","songs":["Espresso","Please Please Please","Nonsense"],"debut_year":2014,"genre":["Pop"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Selena Gomez","songs":["Come & Get It","Lose You to Love Me","Wolves"],"debut_year":2009,"genre":["Pop"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Justin Bieber","songs":["Baby","Sorry","Love Yourself"],"debut_year":2009,"genre":["Pop"],"decades":["2010s","2020s"],"country":"Canada","aliases":["Biebs"],"members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Eminem","songs":["Lose Yourself","The Real Slim Shady","Without Me"],"debut_year":1996,"genre":["Hip-Hop/Rap"],"decades":["90s","2000s","2010s"],"country":"United States","aliases":["Slim Shady","Marshall Mathers"],"members":1,"difficulty":"easy","fun_fact":"Eminem memorizes the dictionary to find new rhyming combinations and has one of hip-hop's largest vocabularies.","spotify_ids":[]},{"name":"2Pac","songs":["California Love","Changes","Dear Mama"],"debut_year":1991,"genre":["Hip-Hop/Rap"],"decades":["90s"],"country":"United States","aliases":["Tupac","Tupac Shakur","Makaveli"],"members":1,"difficulty":"easy","spotify_ids":[]},{"name":"The Notorious B.I.G.","songs":["Hypnotize","Big Poppa","Mo Money Mo Problems"],"debut_year":1994,"genre":["Hip-Hop/Rap"],"decades":["90s"],"country":"United States","aliases":["Biggie","Biggie Smalls","Notorious BIG","Christopher Wallace"],"members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Jay-Z","songs":["Empire State of Mind","99 Problems","Hard Knock Life (Ghetto Anthem)"],"debut_year":1996,"genre":["Hip-Hop/Rap"],"decades":["90s","2000s","2010s"],"country":"United States","aliases":["Hov","Shawn Carter"],"members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Kanye West","songs":["Gold Digger","Stronger","Heartless"],"debut_year":2004,"genre":["Hip-Hop/Rap","Pop"],"decades":["2000s","2010s","2020s"],"country":"United States","aliases":["Ye","Yeezy"],"members":1,"difficulty":"easy","fun_fact":"Kanye recorded his debut single with his jaw wired shut after a near-fatal car accident in 2002.","spotify_ids":[]},{"name":"Nicki Minaj","songs":["Super Bass","Starships","Anaconda"],"debut_year":2007,"genre":["Hip-Hop/Rap","Pop"],"decades":["2010s","2020s"],"country":"Trinidad and Tobago","aliases":["Nicki"],"members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Drake","songs":["One Dance","God's Plan","Hotline Bling"],"debut_year":2006,"genre":["Hip-Hop/Rap","R&B/Soul"],"decades":["2000s","2010s","2020s"],"country":"Canada","aliases":["Drizzy","Champagne Papi"],"members":1,"difficulty":"easy","fun_fact":"Drake appeared as wheelchair-bound Jimmy Brooks on the Canadian teen drama Degrassi before becoming a rapper.","spotify_ids":[]},{"name":"Kendrick Lamar","songs":["HUMBLE.","Swimming Pools (Drank)","DNA."],"debut_year":2009,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","aliases":["K-Dot","Kdot"],"members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Post Malone","songs":["Rockstar","Congratulations","Circles"],"debut_year":2015,"genre":["Hip-Hop/Rap","Pop"],"decades":["2010s","2020s"],"country":"United States","aliases":["Posty"],"members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Cardi B","songs":["Bodak Yellow","I Like It","WAP"],"debut_year":2015,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Tyler the Creator","songs":["EARFQUAKE","See You Again","WUSYANAME"],"debut_year":2009,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","aliases":["Tyler"],"members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Lil Nas X","songs":["Old Town Road","MONTERO (Call Me by Your Name)","INDUSTRY BABY"],"debut_year":2018,"genre":["Pop","Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"50 Cent","songs":["In da Club","Candy Shop","21 Questions"],"debut_year":2002,"genre":["Hip-Hop/Rap"],"decades":["2000s"],"country":"United States","aliases":["Fifty Cent","Curtis Jackson"],"members":1,"difficulty":"medium","spotify_ids":[]},{"name":"The Black Eyed Peas","songs":["I Gotta Feeling","Where Is the Love?","Boom Boom Pow"],"debut_year":1995,"genre":["Hip-Hop/Rap","Pop"],"decades":["2000s","2010s"],"country":"United States","aliases":["Black Eyed Peas"],"members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Childish Gambino","songs":["Redbone","This Is America","3005"],"debut_year":2011,"genre":["Hip-Hop/Rap","R&B/Soul"],"decades":["2010s","2020s"],"country":"United States","aliases":["Donald Glover"],"members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Doja Cat","songs":["Say So","Kiss Me More","Planet Her"],"debut_year":2014,"genre":["Pop","Hip-Hop/Rap","R&B/Soul"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Lauryn Hill","songs":["Doo Wop (That Thing)","Ex-Factor","Everything Is Everything"],"debut_year":1993,"genre":["R&B/Soul","Hip-Hop/Rap"],"decades":["90s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Aretha Franklin","songs":["Respect","Think","(You Make Me Feel Like) A Natural Woman"],"debut_year":1961,"genre":["R&B/Soul"],"decades":["60s","70s","80s"],"country":"United States","aliases":["Queen of Soul"],"members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Marvin Gaye","songs":["What's Going On","Let's Get It On","Sexual Healing"],"debut_year":1961,"genre":["R&B/Soul"],"decades":["60s","70s","80s"],"country":"United States","members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Stevie Wonder","songs":["Superstition","Sir Duke","Isn't She Lovely"],"debut_year":1961,"genre":["R&B/Soul","Pop"],"decades":["60s","70s","80s","90s"],"country":"United States","members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Bob Marley","songs":["No Woman No Cry","Redemption Song","One Love"],"debut_year":1963,"genre":["R&B/Soul"],"decades":["70s"],"country":"Jamaica","aliases":["Robert Nesta Marley"],"members":1,"difficulty":"easy","fun_fact":"Bob Marley's Legend is the best-selling reggae album of all time with over 28 million copies sold.","spotify_ids":[]},{"name":"Alicia Keys","songs":["Fallin'","No One","If I Ain't Got You"],"debut_year":1998,"genre":["R&B/Soul","Pop"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Usher","songs":["Yeah!","Confessions Part II","My Boo"],"debut_year":1994,"genre":["R&B/Soul","Pop"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Amy Winehouse","songs":["Rehab","Valerie","Back to Black"],"debut_year":2003,"genre":["R&B/Soul"],"decades":["2000s"],"country":"United Kingdom","members":1,"difficulty":"medium","fun_fact":"Amy Winehouse won 5 Grammy Awards in a single night in 2008 — the most ever by a British female artist.","spotify_ids":[]},{"name":"Destiny's Child","songs":["Say My Name","Survivor","Bootylicious"],"debut_year":1993,"genre":["R&B/Soul","Pop"],"decades":["90s","2000s"],"country":"United States","members":3,"difficulty":"medium","spotify_ids":[]},{"name":"Frank Ocean","songs":["Thinking Bout You","Novacane","Chanel"],"debut_year":2011,"genre":["R&B/Soul"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"SZA","songs":["Kill Bill","Good Days","Snooze"],"debut_year":2012,"genre":["R&B/Soul","Pop"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"John Legend","songs":["All of Me","Ordinary People","Tonight (Best You Ever Had)"],"debut_year":2004,"genre":["R&B/Soul","Pop"],"decades":["2000s","2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Sam Smith","songs":["Stay with Me","I'm Not the Only One","Unholy"],"debut_year":2012,"genre":["Pop","R&B/Soul"],"decades":["2010s","2020s"],"country":"United Kingdom","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Khalid","songs":["Young Dumb & Broke","Location","Better"],"debut_year":2017,"genre":["R&B/Soul","Pop"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Anderson .Paak","songs":["Come Down","Make It Better","Tints"],"debut_year":2012,"genre":["R&B/Soul","Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","aliases":["Anderson Paak"],"members":1,"difficulty":"hard","spotify_ids":[]},{"name":"The Weeknd","songs":["Blinding Lights","Starboy","Can't Feel My Face"],"debut_year":2010,"genre":["R&B/Soul","Pop"],"decades":["2010s","2020s"],"country":"Canada","aliases":["Abel Tesfaye","Weeknd"],"members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Daft Punk","songs":["Get Lucky","One More Time","Harder, Better, Faster, Stronger"],"debut_year":1993,"genre":["Electronic"],"decades":["90s","2000s","2010s"],"country":"France","members":2,"difficulty":"medium","fun_fact":"Daft Punk never appeared publicly without their robot helmets after adopting the personas in 1999.","spotify_ids":[]},{"name":"Depeche Mode","songs":["Personal Jesus","Enjoy the Silence","Just Can't Get Enough"],"debut_year":1980,"genre":["Electronic"],"decades":["80s","90s","2000s"],"country":"United Kingdom","members":3,"difficulty":"medium","fun_fact":"Depeche Mode has sold over 100 million records, making them one of the most successful electronic acts ever.","spotify_ids":[]},{"name":"Donna Summer","songs":["Hot Stuff","I Feel Love","Last Dance"],"debut_year":1968,"genre":["Electronic","Pop"],"decades":["70s","80s"],"country":"United States","aliases":["Queen of Disco"],"members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Calvin Harris","songs":["Summer","This Is What You Came For","Feel So Close"],"debut_year":2006,"genre":["Electronic","Pop"],"decades":["2000s","2010s","2020s"],"country":"United Kingdom","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Avicii","songs":["Wake Me Up","Hey Brother","Levels"],"debut_year":2008,"genre":["Electronic"],"decades":["2010s"],"country":"Sweden","aliases":["Tim Bergling"],"members":1,"difficulty":"medium","spotify_ids":[]},{"name":"The Chainsmokers","songs":["Closer","Don't Let Me Down","Something Just Like This"],"debut_year":2012,"genre":["Electronic","Pop"],"decades":["2010s","2020s"],"country":"United States","aliases":["Chainsmokers"],"members":2,"difficulty":"medium","spotify_ids":[]},{"name":"Johnny Cash","songs":["Ring of Fire","Hurt","Man in Black"],"debut_year":1955,"genre":["Country"],"decades":["60s","70s","80s","90s"],"country":"United States","aliases":["The Man in Black"],"members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Dolly Parton","songs":["Jolene","I Will Always Love You","9 to 5"],"debut_year":1964,"genre":["Country"],"decades":["70s","80s","90s","2000s"],"country":"United States","members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Garth Brooks","songs":["Friends in Low Places","The Dance","Unanswered Prayers"],"debut_year":1989,"genre":["Country"],"decades":["90s","2000s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Shania Twain","songs":["Man! I Feel Like a Woman!","You're Still the One","That Don't Impress Me Much"],"debut_year":1993,"genre":["Country","Pop"],"decades":["90s","2000s"],"country":"Canada","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Willie Nelson","songs":["On the Road Again","Always on My Mind","Blue Eyes Crying in the Rain"],"debut_year":1956,"genre":["Country"],"decades":["70s","80s","90s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Morgan Wallen","songs":["Last Night","Wasted on You","More Than My Hometown"],"debut_year":2016,"genre":["Country"],"decades":["2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Chris Stapleton","songs":["Tennessee Whiskey","Broken Halos","Either Way"],"debut_year":2015,"genre":["Country"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Shakira","songs":["Hips Don't Lie","Waka Waka (This Time for Africa)","Whenever, Wherever"],"debut_year":1991,"genre":["Latin","Pop"],"decades":["90s","2000s","2010s","2020s"],"country":"Colombia","members":1,"difficulty":"easy","fun_fact":"Shakira speaks 6 languages fluently: Spanish, English, Italian, Portuguese, Arabic, and French.","spotify_ids":[]},{"name":"Bad Bunny","songs":["Dakiti","Me Porto Bonito","Tití Me Preguntó"],"debut_year":2016,"genre":["Latin"],"decades":["2010s","2020s"],"country":"Puerto Rico","aliases":["Benito"],"members":1,"difficulty":"easy","fun_fact":"Bad Bunny was Spotify's most-streamed artist 3 years running (2020, 2021, 2022).","spotify_ids":[]},{"name":"Santana","songs":["Smooth","Black Magic Woman","Oye Como Va"],"debut_year":1966,"genre":["Latin","Rock"],"decades":["70s","80s","90s","2000s"],"country":"Mexico","aliases":["Carlos Santana"],"members":1,"difficulty":"medium","spotify_ids":[]},{"name":"J Balvin","songs":["Mi Gente","Reggaeton Ton (Bomba)","Con Calma"],"debut_year":2009,"genre":["Latin"],"decades":["2010s","2020s"],"country":"Colombia","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Rosalía","songs":["DESPECHÁ","La Fama","Con Altura"],"debut_year":2017,"genre":["Latin","Pop"],"decades":["2010s","2020s"],"country":"Spain","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Nelly","songs":["Hot in Herre","Dilemma","Just a Dream"],"debut_year":1999,"genre":["Hip-Hop/Rap","Pop"],"decades":["2000s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Iron Maiden","songs":["The Trooper","Run to the Hills","Fear of the Dark"],"debut_year":1975,"genre":["Metal"],"decades":["80s","90s"],"country":"United Kingdom","members":6,"difficulty":"medium","spotify_ids":[]},{"name":"Slipknot","songs":["Psychosocial","Wait and Bleed","Duality"],"debut_year":1995,"genre":["Metal"],"decades":["2000s","2010s"],"country":"United States","members":9,"difficulty":"medium","fun_fact":"Slipknot has 9 members and each member is traditionally known by a number (0 through 8).","spotify_ids":[]},{"name":"Ozzy Osbourne","songs":["Crazy Train","Mr. Crowley","Bark at the Moon"],"debut_year":1968,"genre":["Metal","Rock"],"decades":["80s","90s"],"country":"United Kingdom","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Skrillex","songs":["Scary Monsters and Nice Sprites","First of the Year (Equinox)","Bangarang"],"debut_year":2010,"genre":["Electronic"],"decades":["2010s"],"country":"United States","aliases":["Sonny Moore"],"members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Marshmello","songs":["Alone","Happier","Wolves"],"debut_year":2015,"genre":["Electronic","Pop"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Swedish House Mafia","songs":["Don't You Worry Child","One","Save the World"],"debut_year":2008,"genre":["Electronic"],"decades":["2010s"],"country":"Sweden","members":3,"difficulty":"medium","spotify_ids":[]},{"name":"Enrique Iglesias","songs":["Hero","Bailando","I Like It"],"debut_year":1995,"genre":["Latin","Pop"],"decades":["90s","2000s","2010s"],"country":"Spain","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Ozuna","songs":["Taki Taki","El Farsante","La Modelo"],"debut_year":2012,"genre":["Latin"],"decades":["2010s","2020s"],"country":"Puerto Rico","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"The Strokes","songs":["Last Nite","Reptilia","Someday"],"debut_year":1998,"genre":["Indie/Alternative","Rock"],"decades":["2000s","2010s"],"country":"United States","members":5,"difficulty":"medium","spotify_ids":[]},{"name":"Vampire Weekend","songs":["A-Punk","Cousins","Harmony Hall"],"debut_year":2006,"genre":["Indie/Alternative"],"decades":["2000s","2010s","2020s"],"country":"United States","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Glass Animals","songs":["Heat Waves","Gooey","Pork Soda"],"debut_year":2012,"genre":["Indie/Alternative"],"decades":["2010s","2020s"],"country":"United Kingdom","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"The 1975","songs":["Somebody Else","Robbers","The Sound"],"debut_year":2013,"genre":["Indie/Alternative","Pop"],"decades":["2010s","2020s"],"country":"United Kingdom","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"The Who","songs":["My Generation","Baba O'Riley","Pinball Wizard"],"debut_year":1964,"genre":["Rock"],"decades":["60s","70s"],"country":"United Kingdom","members":1,"difficulty":"medium","fun_fact":"Pete Townshend invented the guitar smash after accidentally breaking his guitar on a low ceiling at a show.","spotify_ids":[]},{"name":"The Kinks","songs":["You Really Got Me","Lola","Waterloo Sunset"],"debut_year":1964,"genre":["Rock"],"decades":["60s","70s"],"country":"United Kingdom","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"The Supremes","songs":["Stop! In the Name of Love","You Can't Hurry Love","Baby Love"],"debut_year":1961,"genre":["R&B/Soul","Pop"],"decades":["60s","70s"],"country":"United States","members":3,"difficulty":"medium","spotify_ids":[]},{"name":"The Temptations","songs":["My Girl","Papa Was a Rollin' Stone","Ain't Too Proud to Beg"],"debut_year":1960,"genre":["R&B/Soul"],"decades":["60s","70s"],"country":"United States","members":5,"difficulty":"medium","spotify_ids":[]},{"name":"James Brown","songs":["I Got You (I Feel Good)","Sex Machine","Papa's Got a Brand New Bag"],"debut_year":1956,"genre":["R&B/Soul"],"decades":["60s","70s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Ray Charles","songs":["Hit the Road Jack","Georgia on My Mind","What'd I Say"],"debut_year":1954,"genre":["R&B/Soul"],"decades":["60s","70s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Sam Cooke","songs":["A Change Is Gonna Come","You Send Me","Wonderful World"],"debut_year":1957,"genre":["R&B/Soul","Pop"],"decades":["60s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Otis Redding","songs":["(Sittin' On) The Dock of the Bay","Respect","Try a Little Tenderness"],"debut_year":1963,"genre":["R&B/Soul"],"decades":["60s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Bee Gees","songs":["Stayin' Alive","How Deep Is Your Love","Night Fever"],"debut_year":1958,"genre":["Pop","R&B/Soul"],"decades":["60s","70s","80s"],"country":"United Kingdom","members":3,"difficulty":"medium","spotify_ids":[]},{"name":"Lynyrd Skynyrd","songs":["Sweet Home Alabama","Free Bird","Simple Man"],"debut_year":1964,"genre":["Rock"],"decades":["70s"],"country":"United States","members":6,"difficulty":"medium","spotify_ids":[]},{"name":"Blondie","songs":["Heart of Glass","Call Me","One Way or Another"],"debut_year":1974,"genre":["Rock","Pop"],"decades":["70s","80s"],"country":"United States","members":6,"difficulty":"medium","spotify_ids":[]},{"name":"Billy Joel","songs":["Piano Man","It's Still Rock and Roll to Me","We Didn't Start the Fire"],"debut_year":1971,"genre":["Rock","Pop"],"decades":["70s","80s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Dire Straits","songs":["Money for Nothing","Sultans of Swing","Romeo and Juliet"],"debut_year":1977,"genre":["Rock"],"decades":["70s","80s"],"country":"United Kingdom","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Phil Collins","songs":["In the Air Tonight","Against All Odds","Sussudio"],"debut_year":1981,"genre":["Pop","Rock"],"decades":["80s","90s"],"country":"United Kingdom","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"The Ramones","songs":["Blitzkrieg Bop","I Wanna Be Sedated","Rock 'n' Roll High School"],"debut_year":1976,"genre":["Rock"],"decades":["70s","80s"],"country":"United States","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"The Clash","songs":["London Calling","Should I Stay or Should I Go","Rock the Casbah"],"debut_year":1976,"genre":["Rock"],"decades":["70s","80s"],"country":"United Kingdom","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Genesis","songs":["Invisible Touch","Land of Confusion","Follow You Follow Me"],"debut_year":1967,"genre":["Rock","Pop"],"decades":["70s","80s"],"country":"United Kingdom","members":5,"difficulty":"medium","spotify_ids":[]},{"name":"Neil Young","songs":["Heart of Gold","Rockin' in the Free World","Old Man"],"debut_year":1966,"genre":["Rock","Indie/Alternative"],"decades":["60s","70s","80s","90s"],"country":"Canada","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Joni Mitchell","songs":["Big Yellow Taxi","Both Sides Now","River"],"debut_year":1968,"genre":["Rock","Indie/Alternative"],"decades":["60s","70s"],"country":"Canada","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Cat Stevens","songs":["Wild World","Father and Son","Tea for the Tillerman"],"debut_year":1966,"genre":["Rock","Pop"],"decades":["60s","70s"],"country":"United Kingdom","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Creedence Clearwater Revival","songs":["Proud Mary","Bad Moon Rising","Have You Ever Seen the Rain"],"debut_year":1967,"genre":["Rock"],"decades":["60s","70s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Aerosmith","songs":["Dream On","Sweet Emotion","Walk This Way"],"debut_year":1970,"genre":["Rock"],"decades":["70s","80s","90s"],"country":"United States","members":5,"difficulty":"medium","fun_fact":"Aerosmith is the highest-grossing American rock band of all time, earning over $1 billion in touring revenue.","spotify_ids":[]},{"name":"ZZ Top","songs":["Sharp Dressed Man","Legs","La Grange"],"debut_year":1969,"genre":["Rock"],"decades":["70s","80s"],"country":"United States","members":3,"difficulty":"medium","spotify_ids":[]},{"name":"Journey","songs":["Don't Stop Believin'","Open Arms","Any Way You Want It"],"debut_year":1973,"genre":["Rock","Pop"],"decades":["70s","80s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Foreigner","songs":["I Want to Know What Love Is","Cold as Ice","Juke Box Hero"],"debut_year":1976,"genre":["Rock","Pop"],"decades":["70s","80s"],"country":"United States","members":5,"difficulty":"medium","spotify_ids":[]},{"name":"Van Morrison","songs":["Brown Eyed Girl","Moondance","Into the Mystic"],"debut_year":1964,"genre":["Rock","R&B/Soul"],"decades":["60s","70s"],"country":"United Kingdom","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Stevie Nicks","songs":["Edge of Seventeen","Stop Draggin' My Heart Around","Stand Back"],"debut_year":1981,"genre":["Rock","Pop"],"decades":["80s","90s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Heart","songs":["Barracuda","Crazy on You","Alone"],"debut_year":1973,"genre":["Rock"],"decades":["70s","80s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Hall & Oates","songs":["Maneater","Rich Girl","Sara Smile"],"debut_year":1972,"genre":["Pop","R&B/Soul"],"decades":["70s","80s"],"country":"United States","members":2,"difficulty":"medium","spotify_ids":[]},{"name":"The Cure","songs":["Boys Don't Cry","Lovesong","Friday I'm in Love"],"debut_year":1978,"genre":["Rock","Indie/Alternative"],"decades":["80s","90s"],"country":"United Kingdom","members":1,"difficulty":"medium","fun_fact":"Robert Smith has worn the same smeared red lipstick and black eyeliner on stage for over 40 years.","spotify_ids":[]},{"name":"New Order","songs":["Blue Monday","Bizarre Love Triangle","True Faith"],"debut_year":1980,"genre":["Electronic","Rock"],"decades":["80s","90s"],"country":"United Kingdom","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Tears for Fears","songs":["Everybody Wants to Rule the World","Shout","Mad World"],"debut_year":1981,"genre":["Pop","Rock"],"decades":["80s"],"country":"United Kingdom","members":2,"difficulty":"medium","spotify_ids":[]},{"name":"Eurythmics","songs":["Sweet Dreams (Are Made of This)","Here Comes the Rain Again","Would I Lie to You"],"debut_year":1980,"genre":["Pop","Electronic"],"decades":["80s"],"country":"United Kingdom","members":2,"difficulty":"medium","spotify_ids":[]},{"name":"Janet Jackson","songs":["Nasty","That's the Way Love Goes","All for You"],"debut_year":1982,"genre":["Pop","R&B/Soul"],"decades":["80s","90s","2000s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Tina Turner","songs":["What's Love Got to Do with It","Private Dancer","Simply the Best"],"debut_year":1958,"genre":["Rock","R&B/Soul"],"decades":["60s","70s","80s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"A-ha","songs":["Take On Me","The Sun Always Shines on T.V.","Hunting High and Low"],"debut_year":1982,"genre":["Pop"],"decades":["80s"],"country":"Norway","members":3,"difficulty":"medium","spotify_ids":[]},{"name":"Wham!","songs":["Wake Me Up Before You Go-Go","Careless Whisper","Last Christmas"],"debut_year":1981,"genre":["Pop"],"decades":["80s"],"country":"United Kingdom","members":2,"difficulty":"medium","spotify_ids":[]},{"name":"Culture Club","songs":["Karma Chameleon","Do You Really Want to Hurt Me","Church of the Poison Mind"],"debut_year":1981,"genre":["Pop"],"decades":["80s"],"country":"United Kingdom","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Van Halen","songs":["Jump","Panama","Hot for Teacher"],"debut_year":1974,"genre":["Rock"],"decades":["80s"],"country":"United States","members":4,"difficulty":"medium","fun_fact":"Eddie Van Halen revolutionized rock guitar with his two-handed tapping technique showcased on 'Eruption.'","spotify_ids":[]},{"name":"Mötley Crüe","songs":["Girls, Girls, Girls","Dr. Feelgood","Kickstart My Heart"],"debut_year":1981,"genre":["Rock","Metal"],"decades":["80s","90s"],"country":"United States","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Peter Gabriel","songs":["Sledgehammer","In Your Eyes","Solsbury Hill"],"debut_year":1977,"genre":["Rock","Pop"],"decades":["80s","90s"],"country":"United Kingdom","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"R.E.M.","songs":["Losing My Religion","Everybody Hurts","Man on the Moon"],"debut_year":1980,"genre":["Rock","Indie/Alternative"],"decades":["80s","90s"],"country":"United States","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Talking Heads","songs":["Psycho Killer","Burning Down the House","Once in a Lifetime"],"debut_year":1975,"genre":["Rock","Electronic"],"decades":["70s","80s"],"country":"United States","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"The Smiths","songs":["There Is a Light That Never Goes Out","How Soon Is Now?","This Charming Man"],"debut_year":1982,"genre":["Rock","Indie/Alternative"],"decades":["80s"],"country":"United Kingdom","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Pet Shop Boys","songs":["West End Girls","It's a Sin","Always on My Mind"],"debut_year":1981,"genre":["Electronic","Pop"],"decades":["80s","90s"],"country":"United Kingdom","members":2,"difficulty":"medium","spotify_ids":[]},{"name":"The Human League","songs":["Don't You Want Me","Fascination","Human"],"debut_year":1977,"genre":["Electronic","Pop"],"decades":["80s"],"country":"United Kingdom","members":3,"difficulty":"hard","spotify_ids":[]},{"name":"Beastie Boys","songs":["(You Gotta) Fight for Your Right (To Party)","Sabotage","Intergalactic"],"debut_year":1981,"genre":["Hip-Hop/Rap","Rock"],"decades":["80s","90s"],"country":"United States","members":3,"difficulty":"medium","fun_fact":"The Beastie Boys were originally a hardcore punk band before pivoting to hip-hop in 1983.","spotify_ids":[]},{"name":"Public Enemy","songs":["Fight the Power","911 Is a Joke","Don't Believe the Hype"],"debut_year":1985,"genre":["Hip-Hop/Rap"],"decades":["80s","90s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Run-DMC","songs":["Walk This Way","It's Tricky","My Adidas"],"debut_year":1983,"genre":["Hip-Hop/Rap"],"decades":["80s","90s"],"country":"United States","members":1,"difficulty":"medium","fun_fact":"Run-DMC's 'Walk This Way' collaboration with Aerosmith is credited with bringing hip-hop to mainstream rock audiences.","spotify_ids":[]},{"name":"Rick Astley","songs":["Never Gonna Give You Up","Together Forever","Whenever You Need Somebody"],"debut_year":1987,"genre":["Pop"],"decades":["80s"],"country":"United Kingdom","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Salt-N-Pepa","songs":["Push It","Shoop","Whatta Man"],"debut_year":1985,"genre":["Hip-Hop/Rap"],"decades":["80s","90s"],"country":"United States","members":3,"difficulty":"medium","spotify_ids":[]},{"name":"Backstreet Boys","songs":["I Want It That Way","Everybody (Backstreet's Back)","As Long as You Love Me"],"debut_year":1993,"genre":["Pop"],"decades":["90s","2000s"],"country":"United States","members":5,"difficulty":"easy","spotify_ids":[]},{"name":"NSYNC","songs":["Bye Bye Bye","It's Gonna Be Me","Tearin' Up My Heart"],"debut_year":1995,"genre":["Pop"],"decades":["90s","2000s"],"country":"United States","members":5,"difficulty":"easy","spotify_ids":[]},{"name":"Spice Girls","songs":["Wannabe","Say You'll Be There","2 Become 1"],"debut_year":1994,"genre":["Pop"],"decades":["90s"],"country":"United Kingdom","members":5,"difficulty":"easy","spotify_ids":[]},{"name":"Pearl Jam","songs":["Alive","Black","Even Flow"],"debut_year":1990,"genre":["Rock"],"decades":["90s","2000s"],"country":"United States","members":5,"difficulty":"medium","fun_fact":"Pearl Jam fought Ticketmaster in 1994 over service fees and testified before the US Congress about it.","spotify_ids":[]},{"name":"Soundgarden","songs":["Black Hole Sun","Spoonman","Fell on Black Days"],"debut_year":1984,"genre":["Rock","Metal"],"decades":["90s"],"country":"United States","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Alice in Chains","songs":["Would?","Rooster","Down in a Hole"],"debut_year":1987,"genre":["Rock","Metal"],"decades":["90s","2000s"],"country":"United States","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Stone Temple Pilots","songs":["Plush","Creep","Vasoline"],"debut_year":1989,"genre":["Rock"],"decades":["90s"],"country":"United States","members":4,"difficulty":"hard","spotify_ids":[]},{"name":"Blur","songs":["Song 2","Girls & Boys","Coffee & TV"],"debut_year":1988,"genre":["Rock","Indie/Alternative"],"decades":["90s"],"country":"United Kingdom","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Pulp","songs":["Common People","Disco 2000","Babies"],"debut_year":1978,"genre":["Indie/Alternative","Pop"],"decades":["90s"],"country":"United Kingdom","members":5,"difficulty":"hard","spotify_ids":[]},{"name":"Weezer","songs":["Undone – The Sweater Song","Buddy Holly","Say It Ain't So"],"debut_year":1993,"genre":["Rock","Indie/Alternative"],"decades":["90s","2000s"],"country":"United States","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Beck","songs":["Loser","Where It's At","Devils Haircut"],"debut_year":1993,"genre":["Rock","Indie/Alternative"],"decades":["90s","2000s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Garbage","songs":["Stupid Girl","Only Happy When It Rains","Push It"],"debut_year":1994,"genre":["Rock","Indie/Alternative"],"decades":["90s"],"country":"United States","members":4,"difficulty":"hard","spotify_ids":[]},{"name":"Portishead","songs":["Sour Times","Glory Box","Roads"],"debut_year":1991,"genre":["Electronic","Indie/Alternative"],"decades":["90s"],"country":"United Kingdom","members":3,"difficulty":"hard","spotify_ids":[]},{"name":"Massive Attack","songs":["Teardrop","Angel","Unfinished Sympathy"],"debut_year":1988,"genre":["Electronic"],"decades":["90s","2000s"],"country":"United Kingdom","members":3,"difficulty":"hard","spotify_ids":[]},{"name":"Smashing Pumpkins","songs":["1979","Tonight, Tonight","Bullet with Butterfly Wings"],"debut_year":1988,"genre":["Rock","Indie/Alternative"],"decades":["90s","2000s"],"country":"United States","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Nine Inch Nails","songs":["Closer","Hurt","Head Like a Hole"],"debut_year":1988,"genre":["Rock","Metal","Electronic"],"decades":["90s","2000s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Blink-182","songs":["All the Small Things","What's My Age Again?","Dammit"],"debut_year":1992,"genre":["Rock"],"decades":["90s","2000s"],"country":"United States","members":3,"difficulty":"medium","spotify_ids":[]},{"name":"Nas","songs":["N.Y. State of Mind","If I Ruled the World","One Love"],"debut_year":1994,"genre":["Hip-Hop/Rap"],"decades":["90s","2000s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Wu-Tang Clan","songs":["C.R.E.A.M.","Protect Ya Neck","Gravel Pit"],"debut_year":1993,"genre":["Hip-Hop/Rap"],"decades":["90s","2000s"],"country":"United States","members":9,"difficulty":"medium","spotify_ids":[]},{"name":"A Tribe Called Quest","songs":["Can I Kick It?","Electric Relaxation","Award Tour"],"debut_year":1988,"genre":["Hip-Hop/Rap"],"decades":["90s"],"country":"United States","members":4,"difficulty":"hard","spotify_ids":[]},{"name":"Missy Elliott","songs":["Work It","Get Ur Freak On","Lose Control"],"debut_year":1997,"genre":["Hip-Hop/Rap","R&B/Soul"],"decades":["90s","2000s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"DMX","songs":["Party Up (Up in Here)","Where the Hood At","Ruff Ryders' Anthem"],"debut_year":1998,"genre":["Hip-Hop/Rap"],"decades":["90s","2000s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Outkast","songs":["Hey Ya!","Ms. Jackson","B.O.B."],"debut_year":1994,"genre":["Hip-Hop/Rap"],"decades":["90s","2000s"],"country":"United States","members":2,"difficulty":"medium","spotify_ids":[]},{"name":"Snoop Dogg","songs":["Drop It Like It's Hot","Beautiful","Who Am I? (What's My Name?)"],"debut_year":1993,"genre":["Hip-Hop/Rap"],"decades":["90s","2000s","2010s"],"country":"United States","members":1,"difficulty":"easy","spotify_ids":[]},{"name":"Fugees","songs":["Killing Me Softly","Ready or Not","Fu-Gee-La"],"debut_year":1994,"genre":["Hip-Hop/Rap","R&B/Soul"],"decades":["90s"],"country":"United States","members":3,"difficulty":"medium","spotify_ids":[]},{"name":"TLC","songs":["Waterfalls","No Scrubs","Creep"],"debut_year":1991,"genre":["R&B/Soul","Pop"],"decades":["90s"],"country":"United States","members":3,"difficulty":"easy","spotify_ids":[]},{"name":"Boyz II Men","songs":["End of the Road","I'll Make Love to You","On Bended Knee"],"debut_year":1988,"genre":["R&B/Soul"],"decades":["90s"],"country":"United States","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Brandy","songs":["Have You Ever","The Boy Is Mine","I Wanna Be Down"],"debut_year":1994,"genre":["R&B/Soul","Pop"],"decades":["90s","2000s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"My Chemical Romance","songs":["Welcome to the Black Parade","I'm Not Okay (I Promise)","Helena"],"debut_year":2001,"genre":["Rock"],"decades":["2000s","2010s"],"country":"United States","members":5,"difficulty":"medium","spotify_ids":[]},{"name":"Fall Out Boy","songs":["Sugar, We're Goin Down","Thnks fr th Mmrs","Dance, Dance"],"debut_year":2001,"genre":["Rock","Pop"],"decades":["2000s","2010s"],"country":"United States","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Paramore","songs":["Misery Business","Decode","The Only Exception"],"debut_year":2004,"genre":["Rock","Pop"],"decades":["2000s","2010s"],"country":"United States","members":3,"difficulty":"medium","spotify_ids":[]},{"name":"Panic! at the Disco","songs":["I Write Sins Not Tragedies","Nine in the Afternoon","High Hopes"],"debut_year":2004,"genre":["Rock","Pop"],"decades":["2000s","2010s"],"country":"United States","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"The Killers","songs":["Mr. Brightside","Somebody Told Me","Human"],"debut_year":2001,"genre":["Rock","Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Franz Ferdinand","songs":["Take Me Out","Do You Want To","This Fire"],"debut_year":2002,"genre":["Rock","Indie/Alternative"],"decades":["2000s"],"country":"United Kingdom","members":4,"difficulty":"hard","spotify_ids":[]},{"name":"Arcade Fire","songs":["Wake Up","Rebellion (Lies)","Sprawl II (Mountains Beyond Mountains)"],"debut_year":2001,"genre":["Indie/Alternative"],"decades":["2000s","2010s"],"country":"Canada","members":8,"difficulty":"medium","spotify_ids":[]},{"name":"Interpol","songs":["Obstacle 1","Slow Hands","Evil"],"debut_year":1997,"genre":["Rock","Indie/Alternative"],"decades":["2000s"],"country":"United States","members":4,"difficulty":"hard","spotify_ids":[]},{"name":"Lil Wayne","songs":["A Milli","Lollipop","How to Love"],"debut_year":1995,"genre":["Hip-Hop/Rap"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"P!nk","songs":["So What","Just Give Me a Reason","Get the Party Started"],"debut_year":2000,"genre":["Pop","Rock"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Nelly Furtado","songs":["Maneater","Promiscuous","I'm Like a Bird"],"debut_year":2000,"genre":["Pop"],"decades":["2000s"],"country":"Canada","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Ne-Yo","songs":["So Sick","Miss Independent","Closer"],"debut_year":2006,"genre":["R&B/Soul","Pop"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"T.I.","songs":["Whatever You Like","Live Your Life","Dead and Gone"],"debut_year":2001,"genre":["Hip-Hop/Rap"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Chris Brown","songs":["With You","Yeah 3x","Look at Me Now"],"debut_year":2005,"genre":["R&B/Soul","Pop"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Nickelback","songs":["How You Remind Me","Photograph","Rock Star"],"debut_year":1995,"genre":["Rock"],"decades":["2000s","2010s"],"country":"Canada","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Avril Lavigne","songs":["Complicated","Sk8er Boi","Girlfriend"],"debut_year":2002,"genre":["Rock","Pop"],"decades":["2000s","2010s"],"country":"Canada","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Evanescence","songs":["Bring Me to Life","My Immortal","Going Under"],"debut_year":1995,"genre":["Rock","Metal"],"decades":["2000s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"John Mayer","songs":["Your Body Is a Wonderland","Gravity","Slow Dancing in a Burning Room"],"debut_year":2001,"genre":["Pop","Rock"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Norah Jones","songs":["Come Away with Me","Don't Know Why","Sunrise"],"debut_year":2002,"genre":["Pop","R&B/Soul"],"decades":["2000s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Maroon 5","songs":["Sugar","This Love","Girls Like You"],"debut_year":1994,"genre":["Pop","Rock"],"decades":["2000s","2010s"],"country":"United States","members":5,"difficulty":"medium","spotify_ids":[]},{"name":"OneRepublic","songs":["Apologize","Counting Stars","Secrets"],"debut_year":2002,"genre":["Pop","Rock"],"decades":["2000s","2010s"],"country":"United States","members":5,"difficulty":"medium","spotify_ids":[]},{"name":"Kings of Leon","songs":["Use Somebody","Sex on Fire","Closer"],"debut_year":2000,"genre":["Rock","Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Snow Patrol","songs":["Chasing Cars","Run","Open Your Eyes"],"debut_year":1994,"genre":["Rock","Indie/Alternative"],"decades":["2000s","2010s"],"country":"United Kingdom","members":5,"difficulty":"medium","spotify_ids":[]},{"name":"Keane","songs":["Somewhere Only We Know","Everybody's Changing","Bedshaped"],"debut_year":1997,"genre":["Rock","Pop"],"decades":["2000s","2010s"],"country":"United Kingdom","members":3,"difficulty":"medium","spotify_ids":[]},{"name":"The White Stripes","songs":["Seven Nation Army","Fell in Love with a Girl","Icky Thump"],"debut_year":1997,"genre":["Rock"],"decades":["2000s"],"country":"United States","members":2,"difficulty":"medium","spotify_ids":[]},{"name":"The Black Keys","songs":["Lonely Boy","Gold on the Ceiling","Howlin' for You"],"debut_year":2001,"genre":["Rock"],"decades":["2000s","2010s"],"country":"United States","members":2,"difficulty":"medium","spotify_ids":[]},{"name":"Muse","songs":["Supermassive Black Hole","Uprising","Starlight"],"debut_year":1994,"genre":["Rock","Electronic"],"decades":["2000s","2010s"],"country":"United Kingdom","members":3,"difficulty":"medium","spotify_ids":[]},{"name":"Queens of the Stone Age","songs":["No One Knows","Little Sister","Go with the Flow"],"debut_year":1997,"genre":["Rock","Metal"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Modest Mouse","songs":["Float On","Dashboard","Dramamine"],"debut_year":1992,"genre":["Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Death Cab for Cutie","songs":["I Will Follow You into the Dark","Soul Meets Body","The Sound of Settling"],"debut_year":1997,"genre":["Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"BTS","songs":["Dynamite","Butter","Boy With Luv"],"debut_year":2013,"genre":["Pop"],"decades":["2010s","2020s"],"country":"South Korea","members":7,"difficulty":"easy","fun_fact":"BTS is the first K-pop group to address the United Nations General Assembly, speaking in 2021.","spotify_ids":[]},{"name":"BLACKPINK","songs":["DDU-DU DDU-DU","Kill This Love","How You Like That"],"debut_year":2016,"genre":["Pop"],"decades":["2010s","2020s"],"country":"South Korea","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Travis Scott","songs":["SICKO MODE","Goosebumps","Antidote"],"debut_year":2013,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Future","songs":["Mask Off","March Madness","Low Life"],"debut_year":2012,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"J. Cole","songs":["No Role Modelz","Middle Child","Power Trip"],"debut_year":2011,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Macklemore","songs":["Thrift Shop","Can't Hold Us","Same Love"],"debut_year":2000,"genre":["Hip-Hop/Rap"],"decades":["2010s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Halsey","songs":["Without Me","Bad at Love","Nightmare"],"debut_year":2014,"genre":["Pop","Indie/Alternative"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Hozier","songs":["Take Me to Church","From Eden","Cherry Wine"],"debut_year":2013,"genre":["Indie/Alternative","Rock"],"decades":["2010s","2020s"],"country":"Ireland","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Mumford & Sons","songs":["Little Lion Man","The Cave","I Will Wait"],"debut_year":2007,"genre":["Indie/Alternative","Rock"],"decades":["2010s"],"country":"United Kingdom","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Florence + the Machine","songs":["Dog Days Are Over","Shake It Out","You've Got the Love"],"debut_year":2007,"genre":["Indie/Alternative","Pop"],"decades":["2000s","2010s"],"country":"United Kingdom","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Sia","songs":["Chandelier","Cheap Thrills","Elastic Heart"],"debut_year":2000,"genre":["Pop"],"decades":["2010s"],"country":"Australia","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Bastille","songs":["Pompeii","Good Grief","Things We Lost in the Fire"],"debut_year":2010,"genre":["Indie/Alternative","Pop"],"decades":["2010s"],"country":"United Kingdom","members":4,"difficulty":"medium","spotify_ids":[]},{"name":"Alt-J","songs":["Something Good","Breezeblocks","Tessellate"],"debut_year":2007,"genre":["Indie/Alternative"],"decades":["2010s"],"country":"United Kingdom","members":3,"difficulty":"hard","spotify_ids":[]},{"name":"Of Monsters and Men","songs":["Little Talks","King of Anything","Mountain Sound"],"debut_year":2010,"genre":["Indie/Alternative"],"decades":["2010s"],"country":"Iceland","members":6,"difficulty":"medium","spotify_ids":[]},{"name":"Cage the Elephant","songs":["Shake Me Down","Ain't No Rest for the Wicked","Come a Little Closer"],"debut_year":2006,"genre":["Rock","Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States","members":5,"difficulty":"medium","spotify_ids":[]},{"name":"MGMT","songs":["Kids","Electric Feel","Time to Pretend"],"debut_year":2002,"genre":["Indie/Alternative","Electronic"],"decades":["2000s","2010s"],"country":"United States","members":2,"difficulty":"hard","spotify_ids":[]},{"name":"Zedd","songs":["Stay the Night","Beautiful Now","The Middle"],"debut_year":2012,"genre":["Electronic","Pop"],"decades":["2010s"],"country":"Germany","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"David Guetta","songs":["Titanium","When Love Takes Over","Without You"],"debut_year":2002,"genre":["Electronic","Pop"],"decades":["2000s","2010s"],"country":"France","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Tiësto","songs":["The Business","Red Lights","Adagio for Strings"],"debut_year":1994,"genre":["Electronic"],"decades":["2000s","2010s","2020s"],"country":"Netherlands","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"The National","songs":["Bloodbuzz Ohio","Mr. November","Fake Empire"],"debut_year":1999,"genre":["Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States","members":5,"difficulty":"hard","spotify_ids":[]},{"name":"Lewis Capaldi","songs":["Someone You Loved","Before You Go","Bruises"],"debut_year":2017,"genre":["Pop"],"decades":["2010s","2020s"],"country":"United Kingdom","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Lizzo","songs":["Truth Hurts","Good as Hell","About Damn Time"],"debut_year":2012,"genre":["Pop","R&B/Soul"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Camila Cabello","songs":["Havana","Señorita","Never Be the Same"],"debut_year":2016,"genre":["Pop","Latin"],"decades":["2010s","2020s"],"country":"Cuba","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Megan Thee Stallion","songs":["Savage","Hot Girl Summer","WAP"],"debut_year":2016,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"The Script","songs":["The Man Who Can't Be Moved","Breakeven","Hall of Fame"],"debut_year":2007,"genre":["Pop","Rock"],"decades":["2000s","2010s"],"country":"Ireland","members":3,"difficulty":"medium","spotify_ids":[]},{"name":"Passenger","songs":["Let Her Go","Things That Stop You Dreaming","Scare Away the Dark"],"debut_year":2003,"genre":["Indie/Alternative","Pop"],"decades":["2010s"],"country":"United Kingdom","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Bon Iver","songs":["Skinny Love","Holocene","Towers"],"debut_year":2007,"genre":["Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Fleet Foxes","songs":["White Winter Hymnal","Helplessness Blues","Mykonos"],"debut_year":2006,"genre":["Indie/Alternative"],"decades":["2000s","2010s"],"country":"United States","members":6,"difficulty":"hard","spotify_ids":[]},{"name":"Pantera","songs":["Walk","Cowboys from Hell","Cemetery Gates"],"debut_year":1981,"genre":["Metal"],"decades":["80s","90s","2000s"],"country":"United States","members":4,"difficulty":"hard","fun_fact":"Pantera's guitarist Dimebag Darrell was tragically shot and killed on stage in Columbus, Ohio, in 2004.","spotify_ids":[]},{"name":"System of a Down","songs":["Chop Suey!","B.Y.O.B.","Toxicity"],"debut_year":1994,"genre":["Metal","Rock"],"decades":["2000s"],"country":"United States","members":4,"difficulty":"medium","fun_fact":"All four members of System of a Down are of Armenian descent and advocate for Armenian recognition.","spotify_ids":[]},{"name":"Tool","songs":["Schism","Sober","Forty Six & 2"],"debut_year":1990,"genre":["Metal","Rock"],"decades":["90s","2000s","2010s"],"country":"United States","members":4,"difficulty":"hard","spotify_ids":[]},{"name":"Rammstein","songs":["Du Hast","Sonne","Feuer Frei!"],"debut_year":1994,"genre":["Metal","Rock"],"decades":["90s","2000s","2010s"],"country":"Germany","members":6,"difficulty":"medium","fun_fact":"Rammstein's name references the 1988 Ramstein Air Base airshow disaster in Germany.","spotify_ids":[]},{"name":"Korn","songs":["Freak on a Leash","Coming Undone","Here to Stay"],"debut_year":1993,"genre":["Metal","Rock"],"decades":["90s","2000s"],"country":"United States","members":5,"difficulty":"medium","spotify_ids":[]},{"name":"Kraftwerk","songs":["Autobahn","Trans-Europe Express","The Model"],"debut_year":1969,"genre":["Electronic"],"decades":["70s","80s"],"country":"Germany","members":4,"difficulty":"hard","spotify_ids":[]},{"name":"The Chemical Brothers","songs":["Block Rockin' Beats","Hey Boy Hey Girl","Galvanize"],"debut_year":1989,"genre":["Electronic"],"decades":["90s","2000s"],"country":"United Kingdom","members":2,"difficulty":"hard","spotify_ids":[]},{"name":"The Prodigy","songs":["Firestarter","Breathe","Smack My Bitch Up"],"debut_year":1990,"genre":["Electronic","Rock"],"decades":["90s","2000s"],"country":"United Kingdom","members":2,"difficulty":"hard","spotify_ids":[]},{"name":"Fatboy Slim","songs":["Praise You","Right Here, Right Now","Rockafeller Skank"],"debut_year":1996,"genre":["Electronic"],"decades":["90s","2000s"],"country":"United Kingdom","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Moby","songs":["Porcelain","We Are All Made of Stars","Natural Blues"],"debut_year":1987,"genre":["Electronic"],"decades":["90s","2000s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Luke Combs","songs":["Beautiful Crazy","Beer Never Broke My Heart","Forever After All"],"debut_year":2014,"genre":["Country"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Zach Bryan","songs":["Something in the Orange","Heading South","I Remember Everything"],"debut_year":2019,"genre":["Country"],"decades":["2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Carrie Underwood","songs":["Before He Cheats","Blown Away","Jesus, Take the Wheel"],"debut_year":2005,"genre":["Country","Pop"],"decades":["2000s","2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Kenny Rogers","songs":["The Gambler","Lady","Islands in the Stream"],"debut_year":1958,"genre":["Country"],"decades":["70s","80s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Tim McGraw","songs":["Live Like You Were Dying","It's Your Love","Something Like That"],"debut_year":1993,"genre":["Country"],"decades":["90s","2000s","2010s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Brad Paisley","songs":["Online","Alcohol","Then"],"debut_year":1999,"genre":["Country"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Blake Shelton","songs":["God's Country","Austin","Ol' Red"],"debut_year":2001,"genre":["Country"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Luke Bryan","songs":["This Is How We Roll","Country Girl (Shake It for Me)","Do I"],"debut_year":2004,"genre":["Country"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Keith Urban","songs":["Blue Ain't Your Color","Better Life","Somebody Like You"],"debut_year":1991,"genre":["Country","Pop"],"decades":["2000s","2010s"],"country":"Australia","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Alan Jackson","songs":["Chattahoochee","Remember When","It's Five O'Clock Somewhere"],"debut_year":1989,"genre":["Country"],"decades":["90s","2000s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Daddy Yankee","songs":["Gasolina","Con Calma","Despacito"],"debut_year":1994,"genre":["Latin"],"decades":["2000s","2010s","2020s"],"country":"Puerto Rico","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Karol G","songs":["Tusa","Bichota","Provenza"],"debut_year":2012,"genre":["Latin"],"decades":["2010s","2020s"],"country":"Colombia","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Peso Pluma","songs":["Ella Baila Sola","La Bebe","Chanel"],"debut_year":2020,"genre":["Latin"],"decades":["2020s"],"country":"Mexico","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Marc Anthony","songs":["Vivir Mi Vida","I Need to Know","Valió la Pena"],"debut_year":1988,"genre":["Latin","R&B/Soul"],"decades":["90s","2000s","2010s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Ricky Martin","songs":["Livin' la Vida Loca","She Bangs","Shake Your Bon-Bon"],"debut_year":1984,"genre":["Latin","Pop"],"decades":["90s","2000s"],"country":"Puerto Rico","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Pitbull","songs":["Give Me Everything","Feel This Moment","International Love"],"debut_year":2001,"genre":["Latin","Pop","Hip-Hop/Rap"],"decades":["2000s","2010s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Maluma","songs":["Hawái","Felices los 4","ADMV"],"debut_year":2011,"genre":["Latin"],"decades":["2010s","2020s"],"country":"Colombia","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Lil Baby","songs":["Woah","The Bigger Picture","Sum 2 Prove"],"debut_year":2017,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Juice WRLD","songs":["Lucid Dreams","Legends","All Girls Are the Same"],"debut_year":2018,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"medium","spotify_ids":[]},{"name":"Jack Harlow","songs":["What's Poppin","INDUSTRY BABY","Churchill Downs"],"debut_year":2018,"genre":["Hip-Hop/Rap"],"decades":["2020s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Giveon","songs":["Heartbreak Anniversary","For Tonight","Favorite Mistake"],"debut_year":2019,"genre":["R&B/Soul"],"decades":["2020s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Noah Kahan","songs":["Stick Season","Dial Drunk","She Calls Me Back"],"debut_year":2019,"genre":["Indie/Alternative","Pop"],"decades":["2020s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Benson Boone","songs":["Beautiful Things","Ghost Town","In the Stars"],"debut_year":2022,"genre":["Pop","Rock"],"decades":["2020s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Rod Wave","songs":["Heart on Ice","Richer","Girl of My Dreams"],"debut_year":2018,"genre":["Hip-Hop/Rap","R&B/Soul"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Gunna","songs":["Dollaz on My Head","Baby Birkin","Pushin P"],"debut_year":2016,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Polo G","songs":["Pop Out","Rapstar","Martin & Gina"],"debut_year":2018,"genre":["Hip-Hop/Rap"],"decades":["2010s","2020s"],"country":"United States","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Feid","songs":["Feliz Cumpleaños Ferxxo","Normal","Hey Mor"],"debut_year":2014,"genre":["Latin"],"decades":["2010s","2020s"],"country":"Colombia","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"Rauw Alejandro","songs":["Todo de Ti","Cúrame","Tattoo"],"debut_year":2017,"genre":["Latin"],"decades":["2020s"],"country":"Puerto Rico","members":1,"difficulty":"hard","spotify_ids":[]},{"name":"אריק איינשטיין","aliases":["Arik Einstein","אריק"],"songs":["אני ואתה","עוף גוזל","יורד הגשם"],"debut_year":1961,"genre":["Israeli","Rock","Pop"],"decades":["60s","70s","80s","90s","2000s"],"country":"Israel","members":1,"difficulty":"easy","fun_fact":"Arik Einstein is considered the greatest and most beloved Israeli rock artist of all time.","spotify_ids":[]},{"name":"שלמה ארצי","aliases":["Shlomo Artzi","שלמה"],"songs":["פרפר נחמד","נוגה","אינסוף"],"debut_year":1973,"genre":["Israeli","Pop","Rock"],"decades":["70s","80s","90s","2000s","2010s"],"country":"Israel","members":1,"difficulty":"easy","fun_fact":"Shlomo Artzi has sold more concert tickets in Israel than any other artist in history.","spotify_ids":[]},{"name":"כוורת","aliases":["Kaveret","Poogy"],"songs":["פרג מלבין","יונה","נסייר בכיפה"],"debut_year":1973,"genre":["Israeli","Rock","Pop"],"decades":["70s","80s"],"country":"Israel","members":6,"difficulty":"medium","fun_fact":"Kaveret (The Beehive) is considered Israel's most iconic rock band of the 1970s.","spotify_ids":[]},{"name":"שלום חנוך","aliases":["Shalom Hanoch","Shalom Chanoch"],"songs":["מחכים למשיח","לב האבן","נחשים"],"debut_year":1967,"genre":["Israeli","Rock"],"decades":["60s","70s","80s","90s","2000s"],"country":"Israel","members":1,"difficulty":"medium","fun_fact":"Shalom Hanoch was the first Israeli artist to incorporate electric rock into mainstream Israeli music.","spotify_ids":[]},{"name":"יהודית רביץ","aliases":["Yehudit Ravitz","Judith Ravitz"],"songs":["הלוואי","כמה שאני אוהבת אותך","מה יש לי"],"debut_year":1982,"genre":["Israeli","Pop"],"decades":["80s","90s","2000s","2010s"],"country":"Israel","members":1,"difficulty":"medium","fun_fact":"Yehudit Ravitz is one of the most successful and influential female artists in Israeli pop history.","spotify_ids":[]},{"name":"מתי כספי","aliases":["Matti Caspi","Mati Kaspi"],"songs":["מלכת יופי","שיר השירים","אנה לי ילדה"],"debut_year":1969,"genre":["Israeli","Pop","Rock"],"decades":["70s","80s","90s","2000s"],"country":"Israel","members":1,"difficulty":"hard","fun_fact":"Matti Caspi is known for his sophisticated harmonic arrangements and is considered one of Israel's greatest musical composers.","spotify_ids":[]},{"name":"חוה אלברשטיין","aliases":["Chava Alberstein","Hava Alberstein"],"songs":["לו יהי","מה ידעתי","כשהגשם בא"],"debut_year":1964,"genre":["Israeli","Pop"],"decades":["60s","70s","80s","90s","2000s"],"country":"Israel","members":1,"difficulty":"medium","fun_fact":"Chava Alberstein has recorded over 50 albums and is known as Israel's greatest folk and protest singer.","spotify_ids":[]},{"name":"אהוד בנאי","aliases":["Ehud Banai","Ehud Banay"],"songs":["מאה שנות בדידות","ירושלים שלי","הבאר"],"debut_year":1984,"genre":["Israeli","Rock"],"decades":["80s","90s","2000s","2010s"],"country":"Israel","members":1,"difficulty":"medium","fun_fact":"Ehud Banai comes from one of Israel's most famous musical families and is known for his poetic rock lyrics.","spotify_ids":[]},{"name":"גידי גוב","aliases":["Gidi Gov","Gideon Gov"],"songs":["ג'ינג'י","אין לי בעיה","כמה שאני אוהב"],"debut_year":1972,"genre":["Israeli","Rock","Pop"],"decades":["70s","80s","90s","2000s"],"country":"Israel","members":1,"difficulty":"medium","fun_fact":"Gidi Gov was a founding member of Kaveret and later became one of Israel's most beloved solo performers.","spotify_ids":[]},{"name":"יהורם גאון","aliases":["Yehoram Gaon","Yoram Gaon"],"songs":["ירושלים שלי","ואני חוזר הביתה","אבי אבי"],"debut_year":1960,"genre":["Israeli","Pop"],"decades":["60s","70s","80s","90s"],"country":"Israel","members":1,"difficulty":"hard","fun_fact":"Yehoram Gaon is famous for his role in the Israeli musical film Kazablan and is an icon of classic Israeli entertainment.","spotify_ids":[]},{"name":"עברי לידר","aliases":["Ivri Lider","Ibri Lider"],"songs":["אני לא מקשיב","קצת קר","אולי בגלל הגשם"],"debut_year":1997,"genre":["Israeli","Pop"],"decades":["90s","2000s","2010s"],"country":"Israel","members":1,"difficulty":"medium","fun_fact":"Ivri Lider was one of the first Israeli celebrities to publicly come out as gay, becoming an LGBTQ icon.","spotify_ids":[]},{"name":"אביב גפן","aliases":["Aviv Geffen","Aviv Gifen"],"songs":["נחמה","זמן","להיות ילד"],"debut_year":1991,"genre":["Israeli","Rock"],"decades":["90s","2000s","2010s"],"country":"Israel","members":1,"difficulty":"medium","fun_fact":"Aviv Geffen sang 'Shir LaShalom' at the peace rally where Prime Minister Yitzhak Rabin was assassinated in 1995.","spotify_ids":[]},{"name":"ריטה","aliases":["Rita","ריטה יהוד"],"songs":["שנינו","הרוח שלך","כמה זמן"],"debut_year":1985,"genre":["Israeli","Pop"],"decades":["80s","90s","2000s","2010s"],"country":"Israel","members":1,"difficulty":"medium","fun_fact":"Rita is one of Israel's most successful pop artists and is also known for her albums of Persian/Mizrahi music.","spotify_ids":[]},{"name":"דנה אינטרנשיונל","aliases":["Dana International","דנה"],"songs":["Diva","Cinderella","לאלה"],"debut_year":1993,"genre":["Israeli","Pop","Electronic"],"decades":["90s","2000s","2010s"],"country":"Israel","members":1,"difficulty":"medium","fun_fact":"Dana International won the 1998 Eurovision Song Contest with 'Diva', becoming an LGBTQ icon worldwide.","spotify_ids":[]},{"name":"משינה","aliases":["Mashina"],"songs":["קולות","תנו לי לחיות","מה קורה גבר"],"debut_year":1985,"genre":["Israeli","Rock"],"decades":["80s","90s","2000s"],"country":"Israel","members":4,"difficulty":"medium","fun_fact":"Mashina was one of Israel's biggest rock bands of the late 1980s and 1990s with a gritty urban sound.","spotify_ids":[]},{"name":"אתניקס","aliases":["Ethnix"],"songs":["יש לי תפוז","כמה חדשים","גם ככה"],"debut_year":1985,"genre":["Israeli","Pop","Rock"],"decades":["80s","90s","2000s"],"country":"Israel","members":5,"difficulty":"medium","fun_fact":"Ethnix was one of the defining Israeli bands of the 1980s, blending pop and rock with Hebrew lyrics.","spotify_ids":[]},{"name":"כנסיית השכל","aliases":["Knesiyat HaSekhel","Church of Mind"],"songs":["בסוף של ספטמבר","בגוף ראשון","כוח"],"debut_year":1995,"genre":["Israeli","Rock","Indie/Alternative"],"decades":["90s","2000s","2010s"],"country":"Israel","members":4,"difficulty":"hard","fun_fact":"Knesiyat HaSekhel is considered one of Israel's most important alternative rock bands with deeply philosophical lyrics.","spotify_ids":[]},{"name":"היהודים","aliases":["HaYehudim","The Jews"],"songs":["אהבה בלי גבולות","יורדי הים","צריך לנסוע"],"debut_year":1994,"genre":["Israeli","Rock","Pop"],"decades":["90s","2000s"],"country":"Israel","members":4,"difficulty":"hard","fun_fact":"HaYehudim were known for their energetic live shows and became one of Israel's biggest bands of the 1990s.","spotify_ids":[]},{"name":"טיפקס","aliases":["Tipex","Tip-Ex"],"songs":["תמשיך לרוץ","חוגג","יאללה"],"debut_year":1993,"genre":["Israeli","Rock"],"decades":["90s","2000s","2010s"],"country":"Israel","members":5,"difficulty":"hard","fun_fact":"Tipex blended ska, reggae, and rock into a uniquely Israeli sound and are known for energetic high-energy performances.","spotify_ids":[]},{"name":"שב\"ק ס'","aliases":["Shabak Samech","Shabaks"],"songs":["תל אביב","פה","אנחנו"],"debut_year":1994,"genre":["Israeli","Rock"],"decades":["90s","2000s"],"country":"Israel","members":4,"difficulty":"hard","fun_fact":"Shabak Samech pioneered Israeli punk and alternative rock in the 1990s.","spotify_ids":[]},{"name":"מוניקה סקס","aliases":["Monica Sex"],"songs":["מוניקה","תל אביב שלי","נשיקה"],"debut_year":1996,"genre":["Israeli","Rock","Pop"],"decades":["90s","2000s"],"country":"Israel","members":3,"difficulty":"hard","fun_fact":"Monica Sex were a provocative Israeli alternative rock band known for their frank and urban lyrics.","spotify_ids":[]},{"name":"זהבה בן","aliases":["Zehava Ben","Zahava Ben"],"songs":["טיפה מרה","הגברת","שיר שמחה"],"debut_year":1988,"genre":["Israeli","Pop"],"decades":["80s","90s","2000s"],"country":"Israel","members":1,"difficulty":"medium","fun_fact":"Zehava Ben bridged Mizrahi music and mainstream Israeli pop and became one of the top-selling Israeli artists.","spotify_ids":[]},{"name":"שרית חדד","aliases":["Sarit Hadad"],"songs":["כמעט גן עדן","שלי","מחכה לך"],"debut_year":2000,"genre":["Israeli","Pop"],"decades":["2000s","2010s","2020s"],"country":"Israel","members":1,"difficulty":"medium","fun_fact":"Sarit Hadad represented Israel in Eurovision 2002 and has sold millions of albums in Israel.","spotify_ids":[]},{"name":"קובי פרץ","aliases":["Kobi Peretz","Kobi"],"songs":["בובה שלי","אחד אחד","מיליון"],"debut_year":2006,"genre":["Israeli","Pop"],"decades":["2000s","2010s","2020s"],"country":"Israel","members":1,"difficulty":"medium","fun_fact":"Kobi Peretz is one of Israel's biggest Mizrahi pop stars, with a devoted fanbase across generations.","spotify_ids":[]},{"name":"עידן רייכל","aliases":["Idan Raichel","idan raichel project"],"songs":["בוא אלי","מים","הם"],"debut_year":2002,"genre":["Israeli","Electronic","Pop"],"decades":["2000s","2010s","2020s"],"country":"Israel","members":1,"difficulty":"medium","fun_fact":"Idan Raichel's project combines Israeli, Ethiopian, and world music, and has performed at Carnegie Hall.","spotify_ids":[]},{"name":"נועה קירל","aliases":["Noa Kirel"],"songs":["Unicorn","Boy","מדברים עליי"],"debut_year":2017,"genre":["Israeli","Pop"],"decades":["2010s","2020s"],"country":"Israel","members":1,"difficulty":"easy","fun_fact":"Noa Kirel represented Israel at Eurovision 2023 with 'Unicorn' and finished 3rd place.","spotify_ids":[]},{"name":"אומר אדם","aliases":["Omer Adam"],"songs":["אני שב","מחכה לך","תגיד לי"],"debut_year":2012,"genre":["Israeli","Pop"],"decades":["2010s","2020s"],"country":"Israel","members":1,"difficulty":"medium","fun_fact":"Omer Adam is one of the most-streamed Israeli artists on Spotify and has broken multiple records in Israel.","spotify_ids":[]},{"name":"עדן בן זקן","aliases":["Eden Ben Zaken"],"songs":["הכי טוב","שירה","לך תחפש"],"debut_year":2016,"genre":["Israeli","Pop"],"decades":["2010s","2020s"],"country":"Israel","members":1,"difficulty":"medium","fun_fact":"Eden Ben Zaken broke Israel's Spotify streaming record and became the most-streamed Israeli female artist.","spotify_ids":[]},{"name":"סטטיק ובן אל תבורי","aliases":["Static & Ben El","Static and Ben El Tavori","Static Ben El"],"songs":["Call This Love","Taste","לאן שאת הולכת"],"debut_year":2012,"genre":["Israeli","Pop","R&B/Soul"],"decades":["2010s","2020s"],"country":"Israel","members":2,"difficulty":"medium","fun_fact":"Static & Ben El Tavori are the most internationally recognized Israeli pop duo, with hits in multiple languages.","spotify_ids":[]},{"name":"ישי ריבו","aliases":["Ishay Ribo","Ishai Ribo"],"songs":["כי אשמרה שבת","הניגון שבלב","זה הזמן"],"debut_year":2014,"genre":["Israeli","Pop"],"decades":["2010s","2020s"],"country":"Israel","members":1,"difficulty":"hard","fun_fact":"Ishay Ribo is a religious singer whose music bridges the gap between traditional Jewish themes and contemporary pop.","spotify_ids":[]}];

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
  preRevealedPos:    new Set(),  // artist name pre-revealed positions
  gameOver:          false,
  won:               false,
  score:             { wins: 0, losses: 0 },
  streak:            0,
  gameMode:          'pack',   // 'pack' | 'streak' | 'story'
};

/* ---------- Pack State ---------- */
const pack = {
  artists:    [],
  index:      0,
  active:     false,
  stats: { correct: 0, guessesOnWins: 0, longestStreak: 0, currentStreak: 0 },
};

/* ---------- Streak State ---------- */
const streakMode = {
  active:       false,
  current:      0,
  best:         0,       // session best
  sessionBest:  0,
  total:        0,       // total artists attempted
  correct:      0,
  skipsLeft:    3,
  pool:         [],
  poolIndex:    0,
  milestone:    0,       // last milestone reached
};

/* ---------- Story State ---------- */
const STORY_LEVELS = [
  { num: 1, name: 'Opening Act',       difficulty: 'easy',   guesses: 7, songs: 3, preReveal: 2, size: 8, passAt: 5 },
  { num: 2, name: 'Club Circuit',      difficulty: 'easy',   guesses: 6, songs: 3, preReveal: 1, size: 8, passAt: 5 },
  { num: 3, name: 'Arena Tour',        difficulty: 'medium', guesses: 5, songs: 3, preReveal: 0, size: 8, passAt: 5 },
  { num: 4, name: 'Festival Headliner',difficulty: 'medium', guesses: 5, songs: 2, preReveal: 0, size: 8, passAt: 5 },
  { num: 5, name: 'Stadium Legend',    difficulty: 'hard',   guesses: 4, songs: 2, preReveal: 0, size: 8, passAt: 5 },
  { num: 6, name: 'Hall of Fame',      difficulty: 'hard',   guesses: 3, songs: 2, preReveal: 0, size: 8, passAt: 4 },
];
const story = {
  active:       false,
  currentLevel: 1,  // 1-6
  artistIndex:  0,
  artists:      [],
  stats:        { correct: 0, total: 0 },
  stars:        [0, 0, 0, 0, 0, 0],  // stars per level (0-3)
  unlockedUpTo: 1,
};

/* ---------- localStorage helpers ---------- */
const LS_STREAK  = 'nameThatArtist_streakBest';
const LS_STORY   = 'nameThatArtist_storyProgress';
let lsAvailable  = false;

function lsTest() {
  try { localStorage.setItem('_nta_test', '1'); localStorage.removeItem('_nta_test'); return true; }
  catch (e) { return false; }
}
function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
}

function loadStreakBest() {
  const saved = lsGet(LS_STREAK);
  if (saved && typeof saved.best === 'number') streakMode.sessionBest = saved.best;
}
function saveStreakBest() {
  if (streakMode.current > streakMode.sessionBest) streakMode.sessionBest = streakMode.current;
  lsSet(LS_STREAK, { best: streakMode.sessionBest });
}

function loadStoryProgress() {
  const saved = lsGet(LS_STORY);
  if (!saved) return null;
  return saved;
}
function saveStoryProgress() {
  lsSet(LS_STORY, {
    currentLevel:  story.currentLevel,
    unlockedUpTo:  story.unlockedUpTo,
    stars:         story.stars,
  });
}
function clearStoryProgress() {
  lsSet(LS_STORY, null);
  story.currentLevel = 1;
  story.unlockedUpTo = 1;
  story.stars = [0, 0, 0, 0, 0, 0];
}

/* ---------- Sound ---------- */
let audioCtx = null;
let soundOn   = false;

function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone(freq, duration, type = 'sine', gain = 0.3) {
  if (!soundOn) return;
  ensureAudio();
  const osc = audioCtx.createOscillator();
  const vol = audioCtx.createGain();
  osc.connect(vol);
  vol.connect(audioCtx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  vol.gain.setValueAtTime(gain, audioCtx.currentTime);
  vol.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration);
}

function playCorrect() {
  playTone(523, 0.15); // C5
  setTimeout(() => playTone(659, 0.15), 100); // E5
  setTimeout(() => playTone(784, 0.25), 200); // G5
}
function playWrong() {
  playTone(220, 0.15, 'sawtooth', 0.2); // A3
  setTimeout(() => playTone(196, 0.2, 'sawtooth', 0.15), 120); // G3
}
function playMilestone() {
  [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.2), i * 100));
}

/* ---------- Init ---------- */
function init() {
  lsAvailable = lsTest();
  loadStreakBest();
  const saved = loadStoryProgress();
  if (saved) {
    story.currentLevel = saved.currentLevel || 1;
    story.unlockedUpTo = saved.unlockedUpTo || 1;
    story.stars = saved.stars || [0,0,0,0,0,0];
  }

  state.allArtists = ARTISTS_DATA;
  buildCategoryScreen();
  showScreen('menu');
  setupEventListeners();
  updateMenuScore();
  updateDiffInfo();
  updateSoundBtn();
  updateStreakBestDisplay();

  if (!lsAvailable) {
    const note = document.getElementById('ls-unavailable-note');
    if (note) note.style.display = '';
  }
}

/* ---------- Screen management ---------- */
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + name);
  if (el) el.classList.add('active');
  if (name === 'game') {
    setTimeout(() => {
      const inp = document.getElementById('guess-input');
      if (inp) inp.focus();
    }, 100);
  }
}

/* ---------- Menu ---------- */
function updateMenuScore() {
  const el = document.getElementById('menu-score');
  const wins = state.score.wins, losses = state.score.losses, streak = state.streak;
  if (wins + losses > 0) {
    el.style.display = '';
    document.getElementById('menu-wins').textContent   = wins;
    document.getElementById('menu-losses').textContent = losses;
    document.getElementById('menu-streak').textContent = streak;
  } else {
    el.style.display = 'none';
  }
}

function updateDiffInfo() {
  const cfg = DIFFICULTY_CONFIG[state.difficulty];
  document.getElementById('diff-info').textContent = cfg.label;
}

/* ---------- Category Screen ---------- */
const decades = ['60s','70s','80s','90s','2000s','2010s','2020s'];
const genres  = ['Rock','Pop','Hip-Hop/Rap','R&B/Soul','Electronic','Country','Metal','Indie/Alternative','Latin','Israeli'];

function buildCategoryScreen() {
  const decadeGrid = document.getElementById('decade-grid');
  const genreGrid  = document.getElementById('genre-grid');
  decadeGrid.innerHTML = '';
  genreGrid.innerHTML  = '';

  decades.forEach(d => {
    const count = getArtists('decade', d).length;
    decadeGrid.appendChild(makeCategoryBtn(d, count, () => startGameMode('decade', d)));
  });
  genres.forEach(g => {
    const count = getArtists('genre', g).length;
    genreGrid.appendChild(makeCategoryBtn(g, count, () => startGameMode('genre', g)));
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
  if (type === 'decade') return state.allArtists.filter(a => a.decades && a.decades.includes(value));
  if (type === 'genre')  return state.allArtists.filter(a =>
    a.genre && a.genre.some(g => g.toLowerCase() === value.toLowerCase())
  );
  return state.allArtists;
}

/* ---------- Game Mode Router ---------- */
function startGameMode(type, value) {
  const mode = state.gameMode;
  if (mode === 'streak') {
    startStreakMode(type, value);
  } else if (mode === 'story') {
    // Story mode doesn't come through category select
    showScreen('story');
  } else {
    startPack(type, value);
  }
}

/* ============================================================
   PACK MODE
   ============================================================ */
function startPack(type, value) {
  state.categoryType    = type;
  state.currentCategory = value;
  state.score           = { wins: 0, losses: 0 };
  state.streak          = 0;
  state.gameMode        = 'pack';
  streakMode.active     = false;
  story.active          = false;

  let pool = getArtists(type, value);
  if (pool.length === 0) { alert('No artists in this category!'); return; }
  if (type === 'random') pool = shuffle([...pool]).slice(0, 20);
  else pool = shuffle([...pool]);

  pack.artists = pool;
  pack.index   = 0;
  pack.active  = true;
  pack.stats   = { correct: 0, guessesOnWins: 0, longestStreak: 0, currentStreak: 0 };

  startPackRound();
}

function startPackRound() {
  const artist = pack.artists[pack.index];
  const cfg    = DIFFICULTY_CONFIG[state.difficulty];
  initRound(artist, cfg.guesses, cfg.songs);
}

/* ============================================================
   STREAK MODE
   ============================================================ */
function startStreakMode(type, value) {
  state.categoryType    = type;
  state.currentCategory = value;
  state.gameMode        = 'streak';
  pack.active           = false;
  story.active          = false;
  streakMode.active     = true;
  streakMode.current    = 0;
  streakMode.total      = 0;
  streakMode.correct    = 0;
  streakMode.skipsLeft  = 3;
  streakMode.milestone  = 0;

  // Build infinite pool (will reshuffle when exhausted)
  let pool = getArtists(type, value);
  if (pool.length === 0) { alert('No artists in this category!'); return; }
  streakMode.pool      = shuffle([...pool]);
  streakMode.poolIndex = 0;

  updateStreakUI();
  startStreakRound();
}

function nextStreakArtist() {
  streakMode.poolIndex++;
  if (streakMode.poolIndex >= streakMode.pool.length) {
    streakMode.pool      = shuffle([...getArtists(state.categoryType, state.currentCategory)]);
    streakMode.poolIndex = 0;
  }
  return streakMode.pool[streakMode.poolIndex];
}

function startStreakRound() {
  const artist = streakMode.pool[streakMode.poolIndex];
  const cfg    = DIFFICULTY_CONFIG[state.difficulty];
  streakMode.total++;
  initRound(artist, cfg.guesses, cfg.songs);
  updateStreakUI();
}

function updateStreakUI() {
  const ctr = document.getElementById('streak-counter');
  if (!ctr) return;
  if (streakMode.active) {
    ctr.style.display = '';
    document.getElementById('streak-num').textContent = streakMode.current;
    document.getElementById('streak-skips').textContent = `⏭ ${streakMode.skipsLeft} skips`;
    // Milestone animation
    const milestones = [5,10,15,20];
    const m = milestones.filter(m => streakMode.current >= m).pop();
    const msgs = { 5: '🔥 On Fire!', 10: '🎸 Rock Star!', 15: '🎵 Music Legend!', 20: '👑 Hall of Famer!' };
    const msgEl = document.getElementById('streak-milestone');
    if (m && m > streakMode.milestone) {
      streakMode.milestone = m;
      msgEl.textContent = msgs[m];
      msgEl.classList.add('milestone-pop');
      playMilestone();
      setTimeout(() => { msgEl.classList.remove('milestone-pop'); }, 2000);
    } else if (!m) {
      msgEl.textContent = '';
    }
  } else {
    ctr.style.display = 'none';
  }
}

function skipStreak() {
  if (!streakMode.active || state.gameOver) return;
  if (streakMode.skipsLeft <= 0) { showFeedback('No skips left!', 'info'); return; }
  streakMode.skipsLeft--;
  state.gameOver = true;
  renderArtistBlank(true);
  for (let i = 0; i < state.songsShown; i++) {
    state.revealedSongs.add(i);
    renderSongBlank(i);
  }
  showFeedback('⏭ Skipped!', 'info');
  setTimeout(() => {
    const next = nextStreakArtist();
    startStreakRound();
  }, 1200);
}

/* ============================================================
   STORY MODE
   ============================================================ */
function showStoryScreen() {
  buildStoryLevelMap();
  showScreen('story');
}

function buildStoryLevelMap() {
  const grid = document.getElementById('story-level-grid');
  if (!grid) return;
  grid.innerHTML = '';

  STORY_LEVELS.forEach((lvl, i) => {
    const stars = story.stars[i];
    const unlocked = lvl.num <= story.unlockedUpTo;
    const completed = stars > 0;

    const card = document.createElement('div');
    card.className = `story-level-card ${unlocked ? '' : 'locked'} ${completed ? 'completed' : ''}`;

    const starsHtml = [1,2,3].map(s =>
      `<span class="story-star ${s <= stars ? 'filled' : ''}">★</span>`
    ).join('');

    card.innerHTML = `
      <div class="story-level-num">Level ${lvl.num}</div>
      <div class="story-level-name">${lvl.name}</div>
      <div class="story-stars">${starsHtml}</div>
      <div class="story-level-info">${unlocked ? lvl.difficulty + ' · ' + lvl.guesses + ' guesses' : '🔒 Locked'}</div>
    `;

    if (unlocked) {
      card.addEventListener('click', () => startStoryLevel(lvl.num));
    }
    grid.appendChild(card);
  });
}

function startStoryLevel(levelNum) {
  const lvl = STORY_LEVELS[levelNum - 1];
  story.active       = true;
  story.currentLevel = levelNum;
  story.artistIndex  = 0;
  story.stats        = { correct: 0, total: 0 };
  state.gameMode     = 'story';
  pack.active        = false;
  streakMode.active  = false;

  // Build artist pool for this level
  const pool = shuffle(state.allArtists.filter(a => a.difficulty === lvl.difficulty));
  story.artists = pool.slice(0, lvl.size);

  startStoryRound();
}

function startStoryRound() {
  const lvl    = STORY_LEVELS[story.currentLevel - 1];
  const artist = story.artists[story.artistIndex];
  if (!artist) { showStorySummary(); return; }

  story.stats.total++;
  initRound(artist, lvl.guesses, lvl.songs, lvl.preReveal);
  updateStoryProgress();
  showScreen('game');
}

function updateStoryProgress() {
  const prog = document.getElementById('pack-progress');
  if (!prog) return;
  const lvl = STORY_LEVELS[story.currentLevel - 1];
  prog.style.display = '';
  const total = story.artists.length;
  const current = story.artistIndex + 1;
  document.getElementById('pack-progress-text').textContent = `Lvl ${story.currentLevel}: Artist ${current} / ${total}`;
  document.getElementById('pack-progress-fill').style.width = `${((current - 1) / total) * 100}%`;
  document.getElementById('pack-score-display').innerHTML = `✓ ${story.stats.correct} &nbsp;✗ ${story.stats.total - 1 - story.stats.correct}`;
  document.getElementById('btn-quit-pack').style.display = 'none'; // no quit in story
}

function advanceStoryRound(won) {
  if (won) story.stats.correct++;
  story.artistIndex++;
  if (story.artistIndex >= story.artists.length) {
    showStorySummary();
  } else {
    startStoryRound();
  }
}

function showStorySummary() {
  const lvl     = STORY_LEVELS[story.currentLevel - 1];
  const correct = story.stats.correct;
  const total   = story.artists.length;
  const pct     = Math.round((correct / total) * 100);
  const passed  = correct >= lvl.passAt;

  // Calculate stars
  let stars = 0;
  if (passed) {
    if (pct >= 90) stars = 3;
    else if (pct >= 80) stars = 2;
    else stars = 1;
  }

  // Update story progress
  story.stars[story.currentLevel - 1] = Math.max(story.stars[story.currentLevel - 1], stars);
  if (passed && story.currentLevel < 6) {
    story.unlockedUpTo = Math.max(story.unlockedUpTo, story.currentLevel + 1);
  }
  saveStoryProgress();

  // Show summary
  document.getElementById('story-summary-level').textContent  = `Level ${story.currentLevel}: ${lvl.name}`;
  document.getElementById('story-summary-score').textContent  = `${correct} / ${total} correct (${pct}%)`;
  document.getElementById('story-summary-stars').innerHTML    = [1,2,3].map(s =>
    `<span class="story-star ${s <= stars ? 'filled' : ''}">★</span>`
  ).join('');
  document.getElementById('story-summary-result').textContent = passed ? '✓ Level Passed!' : '✗ Try Again';
  document.getElementById('story-summary-result').className   = `story-result-badge ${passed ? 'passed' : 'failed'}`;
  document.getElementById('btn-story-next-level').style.display = (passed && story.currentLevel < 6) ? '' : 'none';
  document.getElementById('btn-story-retry').style.display    = passed ? 'none' : '';
  document.getElementById('btn-story-retry').style.display    = '';  // always show

  story.active = false;
  showScreen('story-summary');
}

/* ============================================================
   SHARED ROUND INIT
   ============================================================ */
function initRound(artist, maxGuesses, songsShown, forcePreReveal = null) {
  state.currentArtist    = artist;
  state.maxGuesses       = maxGuesses;
  state.guessesRemaining = maxGuesses;
  state.songsShown       = songsShown;
  state.hintsRevealed    = 0;
  state.revealedSongs    = new Set();
  state.songRevealedPos  = [new Set(), new Set(), new Set()];
  state.preRevealedPos   = new Set();
  state.gameOver         = false;
  state.won              = false;

  // Pre-reveal letters for long artist names (or forced count for story mode)
  const nameLetters = artist.name.replace(/\s/g, '');
  let preRevealCount = forcePreReveal !== null ? forcePreReveal : calcPreRevealCount(nameLetters.length);
  if (preRevealCount > 0) {
    pickPreRevealPositions(artist.name, preRevealCount, state.preRevealedPos);
  }

  buildGameScreen();
  showScreen('game');
}

/* ---------- Pre-reveal logic ---------- */
function calcPreRevealCount(nameLen) {
  if (nameLen <= 4) return 0;
  if (nameLen <= 8) return 1;
  if (nameLen <= 12) return 2;
  return 3;
}

function pickPreRevealPositions(name, count, targetSet) {
  // Collect letter positions by word
  const words = [];
  let wordStart = -1;
  for (let i = 0; i <= name.length; i++) {
    const ch = name[i] || ' ';
    if (isLetter(ch)) {
      if (wordStart === -1) wordStart = i;
    } else {
      if (wordStart !== -1) {
        const positions = [];
        for (let j = wordStart; j < i; j++) positions.push(j);
        words.push(positions);
        wordStart = -1;
      }
    }
  }
  if (words.length === 0) return;

  // Spread across different words when possible
  const pickedWords = new Set();
  let attempts = 0;
  while (targetSet.size < count && attempts < 100) {
    attempts++;
    const wordIdx = Math.floor(Math.random() * words.length);
    const word = words[wordIdx];
    // Prefer picking from unused words when possible
    if (pickedWords.has(wordIdx) && words.length > pickedWords.size && attempts < 50) continue;
    const pos = word[Math.floor(Math.random() * word.length)];
    if (!targetSet.has(pos)) {
      targetSet.add(pos);
      pickedWords.add(wordIdx);
    }
  }
}

/* ============================================================
   BUILD GAME SCREEN
   ============================================================ */
function buildGameScreen() {
  document.getElementById('game-category-tag').textContent = state.currentCategory || 'Random';
  document.getElementById('song-row-2').style.display = state.songsShown >= 3 ? '' : 'none';

  // Pack/story progress bar
  const packProg = document.getElementById('pack-progress');
  if (pack.active) {
    packProg.style.display = '';
    updatePackProgress();
    document.getElementById('btn-quit-pack').style.display = '';
  } else if (story.active) {
    updateStoryProgress();
    document.getElementById('btn-quit-pack').style.display = 'none';
  } else if (!streakMode.active) {
    packProg.style.display = 'none';
    document.getElementById('btn-quit-pack').style.display = 'none';
  }

  // Streak counter
  if (streakMode.active) {
    packProg.style.display = 'none';
    document.getElementById('btn-quit-pack').style.display = 'none';
    updateStreakUI();
  }

  // Skip button visibility
  const skipBtn = document.getElementById('btn-skip-streak');
  if (skipBtn) skipBtn.style.display = streakMode.active ? '' : 'none';

  // Clear feedback & inputs
  const fb = document.getElementById('feedback');
  fb.className = 'feedback'; fb.textContent = '';
  document.getElementById('guess-input').value = '';
  document.getElementById('song-guess-input').value = '';

  renderArtistBlank();
  for (let i = 0; i < state.songsShown; i++) renderSongBlank(i);
  updateGuessCounter();
  renderHints();
}

/* ---------- Pack Progress ---------- */
function updatePackProgress() {
  const total   = pack.artists.length;
  const current = pack.index + 1;
  document.getElementById('pack-progress-text').textContent = `Artist ${current} / ${total}`;
  document.getElementById('pack-progress-fill').style.width = `${(pack.index / total) * 100}%`;
  document.getElementById('pack-score-display').innerHTML =
    `✓ ${pack.stats.correct} &nbsp;✗ ${pack.index - pack.stats.correct}`;
}

/* ---------- Character helpers ---------- */
function isLetter(ch) {
  return /[a-zA-Z\u05D0-\u05EA\u05F0-\u05F4]/.test(ch);
}

function charType(ch) {
  if (isLetter(ch)) return 'letter';
  if (ch === ' ')   return 'space';
  return 'punct';
}

function isHebrew(str) {
  return /[\u05D0-\u05EA]/.test(str);
}

function makeCharEl(ch, type, revealed, newlyRevealed, isPreRevealed) {
  const el = document.createElement('span');
  if (type === 'letter') {
    const cls = ['char', 'letter', revealed ? 'revealed' : 'unrevealed'];
    if (newlyRevealed) cls.push('newly-revealed');
    if (isPreRevealed) cls.push('pre-revealed');
    el.className = cls.join(' ');
    el.textContent = revealed ? ch.toUpperCase() : '_';
  } else if (type === 'punct') {
    el.className = 'char punct';
    el.textContent = ch;
  }
  return el;
}

/* ---------- Render Artist Blank ---------- */
function renderArtistBlank(fullyReveal = false) {
  const container = document.getElementById('artist-name-blank');
  const name = state.currentArtist.name;
  const rtl  = isHebrew(name);
  container.setAttribute('dir', rtl ? 'rtl' : 'ltr');
  container.innerHTML = '';

  let wordEl = null;
  for (let i = 0; i < name.length; i++) {
    const ch   = name[i];
    const type = charType(ch);
    if (type === 'space') {
      if (wordEl) { container.appendChild(wordEl); wordEl = null; }
      const gap = document.createElement('span');
      gap.className = 'word-gap'; container.appendChild(gap); continue;
    }
    if (!wordEl) { wordEl = document.createElement('span'); wordEl.className = 'word-group'; }
    const isPre  = type === 'letter' && state.preRevealedPos.has(i);
    const revealed = fullyReveal || isPre || false;
    wordEl.appendChild(makeCharEl(ch, type, revealed, false, isPre && !fullyReveal));
  }
  if (wordEl) container.appendChild(wordEl);
}

/* ---------- Render Song Blank ---------- */
function renderSongBlank(idx, highlightNewPositions = null) {
  const song      = state.currentArtist.songs[idx];
  const container = document.getElementById(`song-${idx}`);
  const fullyRevealed = state.revealedSongs.has(idx);
  const positions = state.songRevealedPos[idx];
  const rtl = isHebrew(song);

  container.innerHTML = '';
  container.className = `song-blank${fullyRevealed ? ' fully-revealed' : ''}`;
  container.setAttribute('dir', rtl ? 'rtl' : 'ltr');

  let wordEl = null;
  for (let i = 0; i < song.length; i++) {
    const ch   = song[i];
    const type = charType(ch);
    if (type === 'space') {
      if (wordEl) { container.appendChild(wordEl); wordEl = null; }
      const gap = document.createElement('span');
      gap.className = 'word-gap'; container.appendChild(gap); continue;
    }
    if (!wordEl) { wordEl = document.createElement('span'); wordEl.className = 'word-group'; }
    const revealed = fullyRevealed || (type === 'letter' && positions.has(i));
    const isNew    = highlightNewPositions && highlightNewPositions.has(i);
    wordEl.appendChild(makeCharEl(ch, type, revealed, isNew, false));
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
  document.getElementById('guess-count-text').textContent = `${state.guessesRemaining} guess${s} remaining`;
}

/* ---------- Context-Aware Hints ---------- */
function getHintMessages() {
  const a   = state.currentArtist;
  const cat = state.categoryType;
  const membersStr = a.members === 1 ? 'Solo artist' : `Members: ${a.members}`;

  // Hint order based on category:
  // Genre mode:  letters, members, debut_year, country+letters
  // Decade mode: letters, members, genre, country+letters
  // Random:      letters, debut_year, genre, country+letters
  if (cat === 'genre') {
    return [
      () => `<strong>Hint 1:</strong> A letter has been revealed in each song title`,
      () => `<strong>Group Size:</strong> ${membersStr}`,
      () => `<strong>Debut Year:</strong> ${a.debut_year}`,
      () => `<strong>Country:</strong> ${a.country} &nbsp;+&nbsp; more letters revealed`,
    ];
  } else if (cat === 'decade') {
    return [
      () => `<strong>Hint 1:</strong> A letter has been revealed in each song title`,
      () => `<strong>Group Size:</strong> ${membersStr}`,
      () => `<strong>Genre:</strong> ${a.genre.join(' / ')}`,
      () => `<strong>Country:</strong> ${a.country} &nbsp;+&nbsp; more letters revealed`,
    ];
  } else {
    return [
      () => `<strong>Hint 1:</strong> A letter has been revealed in each song title`,
      () => `<strong>Debut Year:</strong> ${a.debut_year}`,
      () => `<strong>Genre:</strong> ${a.genre.join(' / ')}`,
      () => `<strong>Country:</strong> ${a.country} &nbsp;+&nbsp; more letters revealed`,
    ];
  }
}

function renderHints() {
  const list = document.getElementById('hints-list');
  document.getElementById('hints-count').textContent = `${state.hintsRevealed} / 4`;

  if (state.hintsRevealed === 0) {
    list.innerHTML = '<p class="no-hints">Make a wrong artist guess to unlock hints…</p>';
    return;
  }

  const msgs = getHintMessages();
  list.innerHTML = '';
  for (let i = 0; i < state.hintsRevealed; i++) {
    const item = document.createElement('div');
    item.className = `hint-item${i === state.hintsRevealed - 1 ? ' animate-in' : ''}`;
    item.innerHTML = `<span style="color:var(--amber)">●</span> ${msgs[i]()}`;
    list.appendChild(item);
  }
}

/* ---------- Letter Revelation ---------- */
const CONSONANTS = new Set('bcdfghjklmnpqrstvwxyz');

function pickRevealPosition(song, revealedPositions) {
  const letters = [];
  for (let i = 0; i < song.length; i++) {
    if (isLetter(song[i]) && !revealedPositions.has(i)) letters.push(i);
  }
  if (letters.length === 0) return -1;
  const consonants = letters.filter(i => CONSONANTS.has(song[i].toLowerCase()));
  const pool = consonants.length > 0 ? consonants : letters;
  return pool[Math.floor(Math.random() * pool.length)];
}

function revealLetterInAllSongs() {
  for (let i = 0; i < state.songsShown; i++) {
    if (state.revealedSongs.has(i)) continue;
    const pos = pickRevealPosition(state.currentArtist.songs[i], state.songRevealedPos[i]);
    if (pos !== -1) {
      state.songRevealedPos[i].add(pos);
      renderSongBlank(i, new Set([pos]));
      setTimeout(() => renderSongBlank(i), 400);
    }
  }
}

/* ---------- Fuzzy Matching ---------- */
function normalize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/^the\s+/i, '')
    .replace(/[^\w\s\u05D0-\u05F4]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function editDistance(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n; if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => j === 0 ? i : 0));
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function fuzzyMatch(guess, answer, aliases) {
  const g = normalize(guess);
  if (g === normalize(answer)) return true;
  for (const alias of (aliases || [])) {
    if (g === normalize(alias)) return true;
  }
  return false;
}

function isClose(guess, answer, aliases) {
  const g = normalize(guess);
  const allForms = [normalize(answer), ...(aliases || []).map(normalize)];
  return allForms.some(f => {
    if (f.length < 3) return false;
    const dist = editDistance(g, f);
    return dist > 0 && dist <= 2;
  });
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

  if (fuzzyMatch(guess, state.currentArtist.name, state.currentArtist.aliases)) {
    onWin();
  } else {
    // Check if close
    if (isClose(guess, state.currentArtist.name, state.currentArtist.aliases)) {
      showFeedback('Close! Try again 🎯', 'info');
    } else {
      onWrongArtistGuess();
    }
  }
}

function onWin() {
  state.gameOver = true;
  state.won      = true;
  state.score.wins++;
  state.streak++;
  playCorrect();

  if (pack.active) {
    pack.stats.correct++;
    pack.stats.currentStreak++;
    pack.stats.guessesOnWins += (state.maxGuesses - state.guessesRemaining + 1);
    if (pack.stats.currentStreak > pack.stats.longestStreak)
      pack.stats.longestStreak = pack.stats.currentStreak;
  }

  if (streakMode.active) {
    streakMode.correct++;
    streakMode.current++;
    if (streakMode.current > streakMode.best) streakMode.best = streakMode.current;
    saveStreakBest();
    updateStreakUI();
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

  playWrong();
  showFeedback('Wrong — try again!', 'wrong');
  flashCard('shake'); flashCard('flash-wrong');
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

  if (streakMode.active) {
    // Streak broken!
    showFeedback('Game over!', 'wrong');
    renderArtistBlank(true);
    for (let i = 0; i < state.songsShown; i++) {
      state.revealedSongs.add(i);
      renderSongBlank(i);
    }
    setTimeout(() => showStreakBroken(), 1400);
    return;
  }

  if (story.active) {
    showFeedback('Game over!', 'wrong');
    renderArtistBlank(true);
    for (let i = 0; i < state.songsShown; i++) {
      state.revealedSongs.add(i);
      renderSongBlank(i);
    }
    setTimeout(() => showResultScreen(), 1400);
    return;
  }

  showFeedback('Game over!', 'wrong');
  renderArtistBlank(true);
  for (let i = 0; i < state.songsShown; i++) {
    state.revealedSongs.add(i);
    renderSongBlank(i);
  }
  setTimeout(() => showResultScreen(), 1400);
}

/* ---------- Streak Broken Screen ---------- */
function showStreakBroken() {
  const pct = streakMode.total > 0
    ? Math.round((streakMode.correct / streakMode.total) * 100) : 0;
  document.getElementById('streak-broken-num').textContent    = streakMode.current;
  document.getElementById('streak-broken-best').textContent   = `Session best: ${streakMode.sessionBest}`;
  document.getElementById('streak-broken-total').textContent  = `${streakMode.total} attempted · ${pct}% correct`;
  streakMode.current = 0;
  streakMode.milestone = 0;
  showScreen('streak-broken');
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
  if (!matched) showFeedback('Not a match — no penalty though!', 'info');
}

/* ---------- Give Up / Quit ---------- */
function giveUp() {
  if (state.gameOver) return;
  onLose();
}
function quitPack() {
  if (!pack.active) return;
  if (!state.gameOver) {
    state.gameOver = true; state.won = false;
    state.score.losses++; pack.stats.currentStreak = 0;
    renderArtistBlank(true);
    for (let i = 0; i < state.songsShown; i++) {
      state.revealedSongs.add(i); renderSongBlank(i);
    }
  }
  pack.index++;
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
  const guessesUsed  = maxGuesses - guessesRemaining + (won ? 1 : 0);
  const isLastArtist = pack.active && pack.index >= pack.artists.length - 1;
  const isLastStory  = story.active && story.artistIndex >= story.artists.length - 1;

  document.getElementById('result-icon').textContent   = won ? '🎉' : '😔';
  document.getElementById('result-title').textContent  = won ? 'You Got It!' : 'Better Luck Next Time!';
  document.getElementById('result-artist').textContent = currentArtist.name;
  document.getElementById('result-songs').innerHTML    = currentArtist.songs
    .slice(0, state.songsShown).map(s => `<li>${s}</li>`).join('');
  document.getElementById('result-stat').textContent   = won
    ? `Guessed in ${guessesUsed} guess${guessesUsed !== 1 ? 'es' : ''}`
    : 'The artist was revealed';
  document.getElementById('result-score').textContent  =
    `Score: ${score.wins}W / ${score.losses}L  ·  🔥 Streak: ${streak}`;

  // Fun fact
  const funFactEl = document.getElementById('result-fun-fact');
  if (funFactEl) {
    if (currentArtist.fun_fact) {
      funFactEl.textContent = '💡 ' + currentArtist.fun_fact;
      funFactEl.style.display = '';
    } else {
      funFactEl.style.display = 'none';
    }
  }

  // YouTube listen links
  buildYoutubeLinks(currentArtist);

  // Button visibility
  const btnNext    = document.getElementById('btn-next-artist');
  const btnSummary = document.getElementById('btn-pack-summary');
  const btnAgain   = document.getElementById('btn-play-again');

  if (story.active) {
    if (!isLastStory) {
      btnNext.style.display    = '';
      btnNext.textContent      = 'Next Artist →';
      btnSummary.style.display = 'none';
      btnAgain.style.display   = 'none';
    } else {
      btnNext.style.display    = 'none';
      btnSummary.style.display = '';
      btnSummary.textContent   = 'View Level Results';
      btnAgain.style.display   = 'none';
    }
  } else if (pack.active && !isLastArtist) {
    btnNext.style.display    = '';
    btnNext.textContent      = 'Next Artist → ';
    btnSummary.style.display = 'none';
    btnAgain.style.display   = 'none';
  } else if (pack.active && isLastArtist) {
    btnNext.style.display    = 'none';
    btnSummary.style.display = '';
    btnSummary.textContent   = 'View Pack Results';
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
    document.getElementById('pack-result-progress').textContent = `Artist ${pack.index + 1} / ${pack.artists.length}`;
    document.getElementById('pack-result-score').textContent = `✓ ${pack.stats.correct}  ✗ ${(pack.index + 1) - pack.stats.correct}`;
  } else {
    badge.style.display = 'none';
  }

  showScreen('result');
  if (pack.active && !isLastArtist) startCountdown(3, advancePackRound);
  if (story.active && !isLastStory) startCountdown(3, () => advanceStoryRound(won));
}

/* ---------- YouTube Links ---------- */
function buildYoutubeLinks(artist) {
  const container = document.getElementById('result-listen');
  if (!container) return;
  container.innerHTML = '';

  const songs = artist.songs.slice(0, state.songsShown);
  const hasSpotify = artist.spotify_ids && artist.spotify_ids.some(id => id);

  const header = document.createElement('div');
  header.className = 'listen-header';
  header.textContent = '🎵 Listen';
  container.appendChild(header);

  songs.forEach((song, i) => {
    const row = document.createElement('div');
    row.className = 'listen-row';

    const songName = document.createElement('span');
    songName.className = 'listen-song-name';
    songName.textContent = song;

    const link = document.createElement('a');
    const query = encodeURIComponent(artist.name + ' ' + song);
    link.href = `https://www.youtube.com/results?search_query=${query}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'listen-link';
    link.textContent = '▶ YouTube';

    row.appendChild(songName);
    row.appendChild(link);
    container.appendChild(row);
  });
}

/* ---------- Countdown ---------- */
function startCountdown(seconds, callback) {
  const bar   = document.getElementById('countdown-bar');
  const fill  = document.getElementById('countdown-fill');
  const label = document.getElementById('countdown-label');
  bar.style.display = '';
  let remaining = seconds;
  label.textContent = `(${remaining})`;
  fill.style.transition = 'none';
  fill.style.width = '100%';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    fill.style.transition = `width ${seconds}s linear`;
    fill.style.width = '0%';
  }));
  countdownTimer = setInterval(() => {
    remaining--;
    label.textContent = remaining > 0 ? `(${remaining})` : '';
    if (remaining <= 0) { clearCountdown(); callback(); }
  }, 1000);
}

function clearCountdown() {
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
  const bar = document.getElementById('countdown-bar');
  if (bar) bar.style.display = 'none';
  const label = document.getElementById('countdown-label');
  if (label) label.textContent = '';
}

/* ---------- Pack Summary ---------- */
function advancePackRound() {
  clearCountdown(); pack.index++;
  if (pack.index >= pack.artists.length) showPackSummary();
  else startPackRound();
}

function calcGrade(pct) {
  if (pct >= 90) return 'A+'; if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';  return 'F';
}

function showPackSummary() {
  clearCountdown(); pack.active = false;
  const total = pack.index, correct = pack.stats.correct;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const avg = correct > 0 ? (pack.stats.guessesOnWins / correct).toFixed(1) : '—';
  document.getElementById('summary-grade').textContent    = calcGrade(pct);
  document.getElementById('summary-correct').textContent  = `${correct} / ${total}`;
  document.getElementById('summary-pct').textContent      = `${pct}%`;
  document.getElementById('summary-avg').textContent      = avg;
  document.getElementById('summary-streak').textContent   = pack.stats.longestStreak;
  document.getElementById('summary-category').textContent = (state.currentCategory || 'Random') + ' · ' + total + ' artist' + (total !== 1 ? 's' : '');
  showScreen('pack-summary');
}

/* ---------- Sound button ---------- */
function updateSoundBtn() {
  const btn = document.getElementById('btn-sound-toggle');
  if (btn) btn.textContent = soundOn ? '🔊' : '🔇';
}

/* ---------- Streak Best Display ---------- */
function updateStreakBestDisplay() {
  const el = document.getElementById('streak-personal-best');
  if (el) el.textContent = streakMode.sessionBest > 0 ? `Personal Best: ${streakMode.sessionBest}` : '';
}

/* ---------- Utility ---------- */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
function setupEventListeners() {
  // Menu — play button shows mode select
  document.getElementById('btn-start').addEventListener('click', () => showScreen('mode-select'));

  // Mode select
  document.getElementById('btn-mode-pack').addEventListener('click', () => {
    state.gameMode = 'pack'; showScreen('category');
  });
  document.getElementById('btn-mode-streak').addEventListener('click', () => {
    state.gameMode = 'streak'; showScreen('category');
  });
  document.getElementById('btn-mode-story').addEventListener('click', () => {
    state.gameMode = 'story'; showStoryScreen();
  });
  document.getElementById('btn-mode-back').addEventListener('click', () => showScreen('menu'));

  // Difficulty
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.difficulty = btn.dataset.difficulty;
      updateDiffInfo();
    });
  });

  // Category screen
  document.getElementById('btn-category-back').addEventListener('click', () => showScreen('mode-select'));
  document.getElementById('btn-random').addEventListener('click', () => {
    if (state.gameMode === 'streak') startStreakMode('random', null);
    else startPack('random', null);
  });

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

  // Give up
  document.getElementById('btn-give-up').addEventListener('click', () => {
    if (!state.gameOver && confirm('Are you sure you want to give up?')) giveUp();
  });

  // Quit pack
  document.getElementById('btn-quit-pack').addEventListener('click', () => {
    if (confirm('Quit pack? Your results so far will be shown.')) quitPack();
  });

  // Skip (streak mode)
  const skipBtn = document.getElementById('btn-skip-streak');
  if (skipBtn) skipBtn.addEventListener('click', skipStreak);

  // Back to menu from game
  document.getElementById('btn-game-menu').addEventListener('click', () => {
    const msg = pack.active || streakMode.active || story.active
      ? 'Return to menu? Your progress will be lost.' : 'Return to menu?';
    if (state.gameOver || confirm(msg)) {
      clearCountdown(); pack.active = false; streakMode.active = false; story.active = false;
      showScreen('menu'); updateMenuScore();
    }
  });

  // Result buttons
  document.getElementById('btn-next-artist').addEventListener('click', () => {
    clearCountdown();
    if (story.active) advanceStoryRound(state.won);
    else advancePackRound();
  });
  document.getElementById('btn-pack-summary').addEventListener('click', () => {
    if (story.active) { advanceStoryRound(state.won); }
    else { pack.index++; showPackSummary(); }
  });
  document.getElementById('btn-play-again').addEventListener('click', () =>
    startPack(state.categoryType, state.currentCategory)
  );
  document.getElementById('btn-change-category').addEventListener('click', () => {
    clearCountdown(); pack.active = false; streakMode.active = false; showScreen('category');
  });
  document.getElementById('btn-main-menu').addEventListener('click', () => {
    clearCountdown(); pack.active = false; streakMode.active = false; story.active = false;
    showScreen('menu'); updateMenuScore();
  });

  // Pack summary
  document.getElementById('btn-replay-pack').addEventListener('click', () =>
    startPack(state.categoryType, state.currentCategory)
  );
  document.getElementById('btn-summary-new-category').addEventListener('click', () => showScreen('category'));
  document.getElementById('btn-summary-menu').addEventListener('click', () => showScreen('menu'));

  // Streak broken
  document.getElementById('btn-streak-tryagain').addEventListener('click', () => {
    startStreakMode(state.categoryType, state.currentCategory);
  });
  document.getElementById('btn-streak-category').addEventListener('click', () => {
    streakMode.active = false; showScreen('category');
  });
  document.getElementById('btn-streak-menu').addEventListener('click', () => {
    streakMode.active = false; showScreen('menu'); updateMenuScore();
  });

  // Story screen
  const storyBackBtn = document.getElementById('btn-story-back');
  if (storyBackBtn) storyBackBtn.addEventListener('click', () => showScreen('mode-select'));

  const storyResetBtn = document.getElementById('btn-story-reset');
  if (storyResetBtn) storyResetBtn.addEventListener('click', () => {
    if (confirm('Reset all Story Mode progress? This cannot be undone.')) {
      clearStoryProgress(); buildStoryLevelMap();
    }
  });

  // Story summary
  document.getElementById('btn-story-next-level').addEventListener('click', () => {
    startStoryLevel(story.currentLevel + 1);
  });
  document.getElementById('btn-story-retry').addEventListener('click', () => {
    startStoryLevel(story.currentLevel);
  });
  document.getElementById('btn-story-summary-menu').addEventListener('click', () => {
    showScreen('menu'); updateMenuScore();
  });
  document.getElementById('btn-story-summary-map').addEventListener('click', () => {
    showStoryScreen();
  });

  // Sound toggle
  const soundBtn = document.getElementById('btn-sound-toggle');
  if (soundBtn) soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    updateSoundBtn();
    if (soundOn) { ensureAudio(); playCorrect(); }
  });
}

/* ---------- Boot ---------- */
init();
