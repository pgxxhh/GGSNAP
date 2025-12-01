
import { Character } from './types';

// Using Data Dragon version 14.1.1 for stability for League of Legends
const LOL_CDN_BASE = 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion';
// Valorant API for official assets
const VAL_CDN_BASE = 'https://media.valorant-api.com/agents';

export const CHARACTERS: Character[] = [
  // --- LEAGUE OF LEGENDS ---
  {
    id: 'ahri',
    name: 'Ahri',
    game: 'League of Legends',
    description: 'Nine-tailed fox mage.',
    stylePrompt: `
      **Character**: Ahri (League of Legends).
      **Visuals**: Fox ears on top of head, nine fluffy white crystal tails behind.
      **Chibi Outfit**: Red and white Ionian robes.
    `,
    color: 'bg-pink-600',
    accentColor: 'border-blue-400',
    imageUrl: `${LOL_CDN_BASE}/Ahri.png`,
  },
  {
    id: 'akali',
    name: 'Akali',
    game: 'League of Legends',
    description: 'Rogue assassin, neon smoke.',
    stylePrompt: `
      **Character**: Akali (League of Legends).
      **Visuals**: High ponytail, face mask (optional), dragon tattoo on back.
      **Chibi Outfit**: Green/black assassin gear.
    `,
    color: 'bg-emerald-700',
    accentColor: 'border-green-400',
    imageUrl: `${LOL_CDN_BASE}/Akali.png`,
  },
  {
    id: 'ashe',
    name: 'Ashe',
    game: 'League of Legends',
    description: 'Ice archer queen.',
    stylePrompt: `
      **Character**: Ashe (League of Legends).
      **Visuals**: White hair, icy blue hood.
      **Chibi Outfit**: Blue/Gold Freljord armor, cape.
    `,
    color: 'bg-sky-600',
    accentColor: 'border-blue-200',
    imageUrl: `${LOL_CDN_BASE}/Ashe.png`,
  },
  {
    id: 'caitlyn',
    name: 'Caitlyn',
    game: 'League of Legends',
    description: 'Sheriff, sniper, top hat.',
    stylePrompt: `
      **Character**: Caitlyn (League of Legends).
      **Visuals**: Long dark purple hair, tall steampunk top hat.
      **Chibi Outfit**: Purple dress/uniform.
    `,
    color: 'bg-indigo-700',
    accentColor: 'border-purple-400',
    imageUrl: `${LOL_CDN_BASE}/Caitlyn.png`,
  },
  {
    id: 'darius',
    name: 'Darius',
    game: 'League of Legends',
    description: 'Noxian commander, axe.',
    stylePrompt: `
      **Character**: Darius (League of Legends).
      **Visuals**: Stern expression, short grey hair.
      **Chibi Outfit**: Massive dark red/black heavy armor.
    `,
    color: 'bg-red-900',
    accentColor: 'border-red-600',
    imageUrl: `${LOL_CDN_BASE}/Darius.png`,
  },
  {
    id: 'ezreal',
    name: 'Ezreal',
    game: 'League of Legends',
    description: 'Explorer, magic gauntlet.',
    stylePrompt: `
      **Character**: Ezreal (League of Legends).
      **Visuals**: Spiky blonde anime hair, goggles on forehead.
      **Chibi Outfit**: Brown aviator jacket.
    `,
    color: 'bg-yellow-600',
    accentColor: 'border-blue-400',
    imageUrl: `${LOL_CDN_BASE}/Ezreal.png`,
  },
  {
    id: 'garen',
    name: 'Garen',
    game: 'League of Legends',
    description: 'Might of Demacia, spin.',
    stylePrompt: `
      **Character**: Garen (League of Legends).
      **Visuals**: Short brown hair, heroic jawline.
      **Chibi Outfit**: Enormous blue/silver shoulder pads, heavy plate armor.
    `,
    color: 'bg-blue-800',
    accentColor: 'border-yellow-400',
    imageUrl: `${LOL_CDN_BASE}/Garen.png`,
  },
  {
    id: 'jhin',
    name: 'Jhin',
    game: 'League of Legends',
    description: 'Virtuoso, mask, four.',
    stylePrompt: `
      **Character**: Jhin (League of Legends).
      **Visuals**: Wearing the iconic asymmetric white smiling mask.
      **Chibi Outfit**: Elegant poncho, mechanical shoulder armor.
    `,
    color: 'bg-red-800',
    accentColor: 'border-yellow-100',
    imageUrl: `${LOL_CDN_BASE}/Jhin.png`,
  },
  {
    id: 'jinx',
    name: 'Jinx',
    game: 'League of Legends',
    description: 'Manic energy, blue braids.',
    stylePrompt: `
      **Character**: Jinx (League of Legends).
      **Visuals**: Long blue braids reaching the floor, manic grin, cloud tattoos.
      **Chibi Outfit**: Striped bikini top, gloves, bullets belts.
    `,
    color: 'bg-pink-600',
    accentColor: 'border-blue-400',
    imageUrl: `${LOL_CDN_BASE}/Jinx.png`,
  },
  {
    id: 'kaisa',
    name: 'Kai\'Sa',
    game: 'League of Legends',
    description: 'Void hunter, bodysuit.',
    stylePrompt: `
      **Character**: Kai'Sa (League of Legends).
      **Visuals**: Long dark hair, purple markings on face.
      **Chibi Outfit**: Tight purple void bio-suit, floating shoulder pods (wings).
    `,
    color: 'bg-purple-900',
    accentColor: 'border-fuchsia-500',
    imageUrl: `${LOL_CDN_BASE}/Kaisa.png`,
  },
  {
    id: 'leesin',
    name: 'Lee Sin',
    game: 'League of Legends',
    description: 'Blind monk, martial arts.',
    stylePrompt: `
      **Character**: Lee Sin (League of Legends).
      **Visuals**: Red cloth blindfold covering eyes.
      **Chibi Outfit**: Shirtless with tattoos or martial arts vest, hand wraps.
    `,
    color: 'bg-amber-700',
    accentColor: 'border-red-500',
    imageUrl: `${LOL_CDN_BASE}/LeeSin.png`,
  },
  {
    id: 'lux',
    name: 'Lux',
    game: 'League of Legends',
    description: 'Lady of Luminosity.',
    stylePrompt: `
      **Character**: Lux (League of Legends).
      **Visuals**: Blonde hair, cheerful expression.
      **Chibi Outfit**: Shining silver/white Demacian armor.
    `,
    color: 'bg-yellow-400',
    accentColor: 'border-white',
    imageUrl: `${LOL_CDN_BASE}/Lux.png`,
  },
  {
    id: 'masteryi',
    name: 'Master Yi',
    game: 'League of Legends',
    description: 'Wuju bladesman, goggles.',
    stylePrompt: `
      **Character**: Master Yi (League of Legends).
      **Visuals**: Multi-lens green goggles covering face, beard.
      **Chibi Outfit**: Yellow/Green armor.
    `,
    color: 'bg-yellow-800',
    accentColor: 'border-green-400',
    imageUrl: `${LOL_CDN_BASE}/MasterYi.png`,
  },
  {
    id: 'missfortune',
    name: 'Miss Fortune',
    game: 'League of Legends',
    description: 'Bounty hunter, pirate.',
    stylePrompt: `
      **Character**: Miss Fortune (League of Legends).
      **Visuals**: Long red hair, large pirate captain hat.
      **Chibi Outfit**: Pirate coat, corset.
    `,
    color: 'bg-red-500',
    accentColor: 'border-yellow-500',
    imageUrl: `${LOL_CDN_BASE}/MissFortune.png`,
  },
  {
    id: 'pyke',
    name: 'Pyke',
    game: 'League of Legends',
    description: 'Bloodharbor Ripper.',
    stylePrompt: `
      **Character**: Pyke (League of Legends).
      **Visuals**: Bald head with bandana/mask, glowing spectral eyes.
      **Chibi Outfit**: Ragged pirate coat.
    `,
    color: 'bg-teal-900',
    accentColor: 'border-green-300',
    imageUrl: `${LOL_CDN_BASE}/Pyke.png`,
  },
  {
    id: 'riven',
    name: 'Riven',
    game: 'League of Legends',
    description: 'Exile, broken blade.',
    stylePrompt: `
      **Character**: Riven (League of Legends).
      **Visuals**: Short white hair, determined look.
      **Chibi Outfit**: Noxian armor pieces, one large pauldron.
    `,
    color: 'bg-gray-500',
    accentColor: 'border-green-400',
    imageUrl: `${LOL_CDN_BASE}/Riven.png`,
  },
  {
    id: 'sett',
    name: 'Sett',
    game: 'League of Legends',
    description: 'The Boss, fighter.',
    stylePrompt: `
      **Character**: Sett (League of Legends).
      **Visuals**: Red hair, vastayan beast ears.
      **Chibi Outfit**: Open vest showing chest, large fur coat draped over shoulders.
    `,
    color: 'bg-orange-800',
    accentColor: 'border-yellow-600',
    imageUrl: `${LOL_CDN_BASE}/Sett.png`,
  },
  {
    id: 'sylas',
    name: 'Sylas',
    game: 'League of Legends',
    description: 'Unshackled, chains.',
    stylePrompt: `
      **Character**: Sylas (League of Legends).
      **Visuals**: Long dark messy hair, beard.
      **Chibi Outfit**: Shirtless/ragged pants, large golden chains on wrists (petricite).
    `,
    color: 'bg-slate-700',
    accentColor: 'border-yellow-200',
    imageUrl: `${LOL_CDN_BASE}/Sylas.png`,
  },
  {
    id: 'teemo',
    name: 'Teemo',
    game: 'League of Legends',
    description: 'Swift scout, shrooms.',
    stylePrompt: `
      **Character**: Teemo (League of Legends).
      **Visuals**: Furry yordle face (or human cosplay of it), eyes closed smiling.
      **Chibi Outfit**: Green scout hat with goggles, red scarf.
    `,
    color: 'bg-green-500',
    accentColor: 'border-red-400',
    imageUrl: `${LOL_CDN_BASE}/Teemo.png`,
  },
  {
    id: 'thresh',
    name: 'Thresh',
    game: 'League of Legends',
    description: 'Chain warden, lantern.',
    stylePrompt: `
      **Character**: Thresh (League of Legends).
      **Visuals**: Spectral green skull/face, floating tendrils.
      **Chibi Outfit**: Ragged robes.
    `,
    color: 'bg-emerald-900',
    accentColor: 'border-green-400',
    imageUrl: `${LOL_CDN_BASE}/Thresh.png`,
  },
  {
    id: 'vi',
    name: 'Vi',
    game: 'League of Legends',
    description: 'Pink hair, brawler, gauntlets.',
    stylePrompt: `
      **Character**: Vi (League of Legends).
      **Visuals**: Pink messy hair, face tattoo "VI", goggles on head.
      **Chibi Outfit**: Steampunk armor.
    `,
    color: 'bg-rose-700',
    accentColor: 'border-yellow-500',
    imageUrl: `${LOL_CDN_BASE}/Vi.png`,
  },
  {
    id: 'viego',
    name: 'Viego',
    game: 'League of Legends',
    description: 'Ruined King.',
    stylePrompt: `
      **Character**: Viego (League of Legends).
      **Visuals**: White hair, green triangular crown floating.
      **Chibi Outfit**: Open leather jacket, glowing green hole in chest.
    `,
    color: 'bg-emerald-950',
    accentColor: 'border-green-500',
    imageUrl: `${LOL_CDN_BASE}/Viego.png`,
  },
  {
    id: 'yasuo',
    name: 'Yasuo',
    game: 'League of Legends',
    description: 'Unforgiven, wind.',
    stylePrompt: `
      **Character**: Yasuo (League of Legends).
      **Visuals**: High messy ponytail, wind aura.
      **Chibi Outfit**: Blue samurai robes, rope belt.
    `,
    color: 'bg-blue-600',
    accentColor: 'border-gray-300',
    imageUrl: `${LOL_CDN_BASE}/Yasuo.png`,
  },
  {
    id: 'yone',
    name: 'Yone',
    game: 'League of Legends',
    description: 'Unforgotten, dual swords.',
    stylePrompt: `
      **Character**: Yone (League of Legends).
      **Visuals**: Long dark hair, red mask (optional).
      **Chibi Outfit**: Bandages on chest.
    `,
    color: 'bg-red-900',
    accentColor: 'border-gray-200',
    imageUrl: `${LOL_CDN_BASE}/Yone.png`,
  },
  {
    id: 'zed',
    name: 'Zed',
    game: 'League of Legends',
    description: 'Master of shadows.',
    stylePrompt: `
      **Character**: Zed (League of Legends).
      **Visuals**: Full metal mask, glowing red eyes.
      **Chibi Outfit**: Red and black ninja armor.
    `,
    color: 'bg-gray-900',
    accentColor: 'border-red-600',
    imageUrl: `${LOL_CDN_BASE}/Zed.png`,
  },

  // --- VALORANT: DUELISTS ---
  {
    id: 'jett',
    name: 'Jett',
    game: 'Valorant',
    description: 'Wind assassin, white hair.',
    stylePrompt: `
      **Character**: Jett (Valorant).
      **Visuals**: White hair tied back, wind effects.
      **Chibi Outfit**: Blue hood/windbreaker.
    `,
    color: 'bg-cyan-500',
    accentColor: 'border-white',
    imageUrl: `${VAL_CDN_BASE}/add6443a-41bd-e414-f685-db95638a0f06/displayicon.png`,
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    game: 'Valorant',
    description: 'Fire duelist, street style.',
    stylePrompt: `
      **Character**: Phoenix (Valorant).
      **Visuals**: High-top fade hair with fire tips.
      **Chibi Outfit**: White jacket with fire accents.
    `,
    color: 'bg-orange-500',
    accentColor: 'border-yellow-400',
    imageUrl: `${VAL_CDN_BASE}/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png`,
  },
  {
    id: 'reyna',
    name: 'Reyna',
    game: 'Valorant',
    description: 'Vampiric, purple glow.',
    stylePrompt: `
      **Character**: Reyna (Valorant).
      **Visuals**: Purple hair, glowing purple eyes.
      **Chibi Outfit**: Dark purple combat suit, gold hoops.
    `,
    color: 'bg-purple-800',
    accentColor: 'border-fuchsia-500',
    imageUrl: `${VAL_CDN_BASE}/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png`,
  },
  {
    id: 'raze',
    name: 'Raze',
    game: 'Valorant',
    description: 'Explosives, headphones.',
    stylePrompt: `
      **Character**: Raze (Valorant).
      **Visuals**: Big headphones, cap, paint on face.
      **Chibi Outfit**: Orange jacket, grenades on belt.
    `,
    color: 'bg-orange-600',
    accentColor: 'border-green-400',
    imageUrl: `${VAL_CDN_BASE}/f94c3b30-42be-e959-889c-5aa313dba261/displayicon.png`,
  },
  {
    id: 'yoru',
    name: 'Yoru',
    game: 'Valorant',
    description: 'Blue flames, stylish.',
    stylePrompt: `
      **Character**: Yoru (Valorant).
      **Visuals**: Spiky blue/black hair.
      **Chibi Outfit**: Jacket with skull logo, blue flame aura.
    `,
    color: 'bg-blue-800',
    accentColor: 'border-orange-500',
    imageUrl: `${VAL_CDN_BASE}/7f94d92c-4234-0a36-9e85-3686c1385cf1/displayicon.png`,
  },
  {
    id: 'neon',
    name: 'Neon',
    game: 'Valorant',
    description: 'Speedster, electric blue.',
    stylePrompt: `
      **Character**: Neon (Valorant).
      **Visuals**: Electric blue twin buns, yellow lightning patterns.
      **Chibi Outfit**: Athletic blue/yellow gear, electricity sparks.
    `,
    color: 'bg-blue-500',
    accentColor: 'border-yellow-300',
    imageUrl: `${VAL_CDN_BASE}/bb2a4828-46eb-8cd1-e765-15848195d751/displayicon.png`,
  },
  {
    id: 'iso',
    name: 'Iso',
    game: 'Valorant',
    description: 'Shielded, hood, purple.',
    stylePrompt: `
      **Character**: Iso (Valorant).
      **Visuals**: Wearing a hood, purple geometric energy.
      **Chibi Outfit**: Techwear hood and vest, hexagon patterns.
    `,
    color: 'bg-violet-900',
    accentColor: 'border-purple-400',
    imageUrl: `${VAL_CDN_BASE}/0e38b510-41a8-57c3-f61b-c95bc1496a32/displayicon.png`,
  },

  // --- VALORANT: SENTINELS ---
  {
    id: 'sage',
    name: 'Sage',
    game: 'Valorant',
    description: 'Healer, jade ponytail.',
    stylePrompt: `
      **Character**: Sage (Valorant).
      **Visuals**: High black ponytail, jade accessories.
      **Chibi Outfit**: Traditional/Tactical robe.
    `,
    color: 'bg-emerald-600',
    accentColor: 'border-teal-300',
    imageUrl: `${VAL_CDN_BASE}/569fdd95-4d10-43ab-ca64-394df7112eb0/displayicon.png`,
  },
  {
    id: 'killjoy',
    name: 'Killjoy',
    game: 'Valorant',
    description: 'Tech genius, yellow jacket.',
    stylePrompt: `
      **Character**: Killjoy (Valorant).
      **Visuals**: Round glasses, beanie.
      **Chibi Outfit**: Puffy yellow jacket, tech gloves.
    `,
    color: 'bg-yellow-500',
    accentColor: 'border-green-500',
    imageUrl: `${VAL_CDN_BASE}/1e58de9c-4950-5125-93e9-a0aee9f98746/displayicon.png`,
  },
  {
    id: 'cypher',
    name: 'Cypher',
    game: 'Valorant',
    description: 'Spy, fedora, mask.',
    stylePrompt: `
      **Character**: Cypher (Valorant).
      **Visuals**: White hat, camera eye.
      **Chibi Outfit**: White trench coat, mysterious mask.
    `,
    color: 'bg-gray-200',
    accentColor: 'border-blue-400',
    imageUrl: `${VAL_CDN_BASE}/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png`,
  },
  {
    id: 'chamber',
    name: 'Chamber',
    game: 'Valorant',
    description: 'Sharpshooter, suit, gold.',
    stylePrompt: `
      **Character**: Chamber (Valorant).
      **Visuals**: Glasses, gold tattoos.
      **Chibi Outfit**: Elegant suit and vest, gold accents.
    `,
    color: 'bg-amber-100',
    accentColor: 'border-yellow-600',
    imageUrl: `${VAL_CDN_BASE}/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/displayicon.png`,
  },
  {
    id: 'deadlock',
    name: 'Deadlock',
    game: 'Valorant',
    description: 'Winter gear, blonde braid.',
    stylePrompt: `
      **Character**: Deadlock (Valorant).
      **Visuals**: Blonde braid, mechanical arm.
      **Chibi Outfit**: Heavy winter tactical gear.
    `,
    color: 'bg-slate-300',
    accentColor: 'border-cyan-600',
    imageUrl: `${VAL_CDN_BASE}/cc8b64c8-4b25-4ff9-6e7f-37b4da43d234/displayicon.png`,
  },
  {
    id: 'vyse',
    name: 'Vyse',
    game: 'Valorant',
    description: 'Metallic, rose thorns.',
    stylePrompt: `
      **Character**: Vyse (Valorant).
      **Visuals**: Metallic mask/face, rose thorns.
      **Chibi Outfit**: Dark metallic armor, floral patterns.
    `,
    color: 'bg-zinc-600',
    accentColor: 'border-rose-400',
    imageUrl: `${VAL_CDN_BASE}/266ed4c1-4b63-2253-b9fe-449b2f90111a/displayicon.png`,
  },

  // --- VALORANT: INITIATORS ---
  {
    id: 'sova',
    name: 'Sova',
    game: 'Valorant',
    description: 'Hunter, blonde, cape.',
    stylePrompt: `
      **Character**: Sova (Valorant).
      **Visuals**: Blonde hair, one blue robot eye.
      **Chibi Outfit**: Blue cape, winter hunter gear.
    `,
    color: 'bg-blue-300',
    accentColor: 'border-blue-600',
    imageUrl: `${VAL_CDN_BASE}/ded3520f-4264-bfed-162d-b080e2abccf9/displayicon.png`,
  },
  {
    id: 'breach',
    name: 'Breach',
    game: 'Valorant',
    description: 'Bionic arms, ponytail.',
    stylePrompt: `
      **Character**: Breach (Valorant).
      **Visuals**: Ginger ponytail, beard.
      **Chibi Outfit**: Green tactical vest, huge mechanical arms.
    `,
    color: 'bg-amber-700',
    accentColor: 'border-orange-600',
    imageUrl: `${VAL_CDN_BASE}/5f8d3a7f-467b-97f3-062c-13acf203c006/displayicon.png`,
  },
  {
    id: 'skye',
    name: 'Skye',
    game: 'Valorant',
    description: 'Nature, green headband.',
    stylePrompt: `
      **Character**: Skye (Valorant).
      **Visuals**: Green headband, braided hair.
      **Chibi Outfit**: Green nature-themed tactical gear.
    `,
    color: 'bg-green-600',
    accentColor: 'border-emerald-300',
    imageUrl: `${VAL_CDN_BASE}/6f2a04ca-43e0-be17-7f36-b3908627744d/displayicon.png`,
  },
  {
    id: 'kayo',
    name: 'KAY/O',
    game: 'Valorant',
    description: 'Robot, suppressor.',
    stylePrompt: `
      **Character**: KAY/O (Valorant).
      **Visuals**: Full robot body, screen face.
      **Chibi Outfit**: Blocky metal body, tactical pouches.
    `,
    color: 'bg-slate-500',
    accentColor: 'border-blue-400',
    imageUrl: `${VAL_CDN_BASE}/601dbbe7-43ce-be57-2a40-4abd24953621/displayicon.png`,
  },
  {
    id: 'fade',
    name: 'Fade',
    game: 'Valorant',
    description: 'Nightmare, dark eyes.',
    stylePrompt: `
      **Character**: Fade (Valorant).
      **Visuals**: Messy hair, dark eye makeup.
      **Chibi Outfit**: Dark grey/black tactical gear, nightmare shadows.
    `,
    color: 'bg-gray-800',
    accentColor: 'border-indigo-900',
    imageUrl: `${VAL_CDN_BASE}/ade91515-4379-1a89-cde4-5892ca5253e0/displayicon.png`,
  },
  {
    id: 'gekko',
    name: 'Gekko',
    game: 'Valorant',
    description: 'Green hair, creatures.',
    stylePrompt: `
      **Character**: Gekko (Valorant).
      **Visuals**: Green hair, tattoos.
      **Chibi Outfit**: Purple vest, streetwear style.
    `,
    color: 'bg-lime-400',
    accentColor: 'border-purple-500',
    imageUrl: `${VAL_CDN_BASE}/e370fa57-4757-3604-3648-4993557f6181/displayicon.png`,
  },

  // --- VALORANT: CONTROLLERS ---
  {
    id: 'brimstone',
    name: 'Brimstone',
    game: 'Valorant',
    description: 'Commander, beard, beret.',
    stylePrompt: `
      **Character**: Brimstone (Valorant).
      **Visuals**: Orange beret, thick beard.
      **Chibi Outfit**: Heavy tactical armor, wrist computer.
    `,
    color: 'bg-orange-700',
    accentColor: 'border-gray-500',
    imageUrl: `${VAL_CDN_BASE}/9f0d8ba9-4140-b941-57d3-a99318a4eb2e/displayicon.png`,
  },
  {
    id: 'viper',
    name: 'Viper',
    game: 'Valorant',
    description: 'Poison, green mask.',
    stylePrompt: `
      **Character**: Viper (Valorant).
      **Visuals**: Black hair, green mask (optional).
      **Chibi Outfit**: Green/Black skinsuit, poison canisters.
    `,
    color: 'bg-emerald-800',
    accentColor: 'border-lime-500',
    imageUrl: `${VAL_CDN_BASE}/707eab51-4836-f488-046a-cda6bf494859/displayicon.png`,
  },
  {
    id: 'omen',
    name: 'Omen',
    game: 'Valorant',
    description: 'Shadow, hood, glowing.',
    stylePrompt: `
      **Character**: Omen (Valorant).
      **Visuals**: Hooded shadow face, three glowing slits.
      **Chibi Outfit**: Dark purple armor, shredded cape.
    `,
    color: 'bg-indigo-900',
    accentColor: 'border-blue-500',
    imageUrl: `${VAL_CDN_BASE}/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png`,
  },
  {
    id: 'astra',
    name: 'Astra',
    game: 'Valorant',
    description: 'Cosmic, gold arm.',
    stylePrompt: `
      **Character**: Astra (Valorant).
      **Visuals**: Gold arm, purple cosmic aura.
      **Chibi Outfit**: Purple/Gold outfit, floating scarf.
    `,
    color: 'bg-purple-600',
    accentColor: 'border-yellow-400',
    imageUrl: `${VAL_CDN_BASE}/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/displayicon.png`,
  },
  {
    id: 'harbor',
    name: 'Harbor',
    game: 'Valorant',
    description: 'Water, beard, teal.',
    stylePrompt: `
      **Character**: Harbor (Valorant).
      **Visuals**: Beard, man-bun.
      **Chibi Outfit**: Teal tactical gear, water artifacts.
    `,
    color: 'bg-teal-700',
    accentColor: 'border-cyan-400',
    imageUrl: `${VAL_CDN_BASE}/95b78ed7-4637-86d9-7e41-71ba8c293152/displayicon.png`,
  },
  {
    id: 'clove',
    name: 'Clove',
    game: 'Valorant',
    description: 'Butterflies, pink jacket.',
    stylePrompt: `
      **Character**: Clove (Valorant).
      **Visuals**: Short dark hair, pink jacket.
      **Chibi Outfit**: Cute pink jacket, butterfly motifs.
    `,
    color: 'bg-pink-400',
    accentColor: 'border-fuchsia-300',
    imageUrl: `${VAL_CDN_BASE}/2547a4e3-4d66-996b-9ba8-1e99e356c79d/displayicon.png`,
  }
];

export const POLAROID_DIMENSIONS = {
  width: 320,
  height: 400,
};

// --- DEMO GALLERY CONFIGURATION ---
// These are the photos shown in the "Archive" when a user first visits the site.
export const DEMO_ITEMS_CONFIG = [
  {
    id: 'demo-1',
    characterId: 'jinx', 
    generatedUrl: 'https://storage.googleapis.com/ggsnap-images/ggsnap-1764412712888.png', 
  },
  {
    id: 'demo-2',
    characterId: 'jett', 
    generatedUrl: 'https://storage.googleapis.com/ggsnap-images/toon-1764322853685.png',
  },
  {
    id: 'demo-3',
    characterId: 'killjoy', 
    generatedUrl: 'https://storage.googleapis.com/ggsnap-images/toon-1764323292998.png',
  },
  {
    id: 'demo-4',
    characterId: 'chamber', 
    generatedUrl: 'https://storage.googleapis.com/ggsnap-images/toon-1764324249880.png',
  },
];
