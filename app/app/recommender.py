"""Place recommendation engine for WanderFive.

Three tiers, tried in order, so the app never breaks and never needs a key:

1. Live LLM (Anthropic) — used only if ANTHROPIC_API_KEY is set. Handles any
   location with fresh, tailored reasoning.
2. Curated dataset — a hand-picked list of well-known places for ~25 popular
   destinations, matched by name/alias. No key required.
3. Generic template — always available fallback for any location string that
   doesn't match the curated set, so the app always returns 5 results.
"""
from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass


@dataclass
class PlaceSuggestion:
    name: str
    description: str
    is_generic: bool = False


def _normalize(location: str) -> str:
    return re.sub(r"[^a-z0-9 ]", "", location.strip().lower())


ALIASES = {
    "nyc": "new york",
    "new york city": "new york",
    "the big apple": "new york",
    "la": "los angeles",
    "sf": "san francisco",
    "san fran": "san francisco",
    "hk": "hong kong",
    "the eternal city": "rome",
    "the city of light": "paris",
}

CURATED: dict[str, list[dict]] = {
    "paris": [
        {"name": "Eiffel Tower", "description": "The iconic iron lattice tower and symbol of Paris, with sweeping views over the whole city."},
        {"name": "Louvre Museum", "description": "The world's largest art museum, home to the Mona Lisa and thousands of years of art history."},
        {"name": "Notre-Dame Cathedral", "description": "A masterpiece of French Gothic architecture on the Île de la Cité, still being restored after the 2019 fire."},
        {"name": "Montmartre & Sacré-Cœur", "description": "A hilltop village-like district with cobblestone streets, artists' squares, and a striking white basilica."},
        {"name": "Musée d'Orsay", "description": "A former railway station turned museum, holding the world's finest collection of Impressionist masterpieces."},
    ],
    "london": [
        {"name": "Tower of London", "description": "A historic castle on the Thames holding the Crown Jewels and nearly 1,000 years of royal history."},
        {"name": "British Museum", "description": "A vast, free museum spanning human history, from the Rosetta Stone to the Parthenon sculptures."},
        {"name": "Buckingham Palace", "description": "The King's official residence, famous for the Changing of the Guard ceremony."},
        {"name": "The London Eye", "description": "A giant observation wheel on the South Bank offering panoramic views of the city skyline."},
        {"name": "Camden Market", "description": "An eclectic market district known for street food, vintage fashion, and alternative culture."},
    ],
    "new york": [
        {"name": "Central Park", "description": "An 843-acre green oasis in the middle of Manhattan, great for walking, boating, and people-watching."},
        {"name": "Statue of Liberty", "description": "The iconic symbol of freedom on Liberty Island, reachable by ferry with views of the harbor."},
        {"name": "Metropolitan Museum of Art", "description": "One of the world's great art museums, with collections spanning 5,000 years of culture."},
        {"name": "Times Square", "description": "The dazzling, always-on heart of Midtown, packed with billboards, theaters, and energy."},
        {"name": "Brooklyn Bridge", "description": "A 19th-century engineering marvel connecting Manhattan and Brooklyn, best walked at sunset."},
    ],
    "tokyo": [
        {"name": "Senso-ji Temple", "description": "Tokyo's oldest temple, in the historic Asakusa district, with a lively market street leading to its gate."},
        {"name": "Shibuya Crossing", "description": "The world's busiest pedestrian crossing, a defining image of modern Tokyo."},
        {"name": "Meiji Shrine", "description": "A tranquil forested shrine dedicated to Emperor Meiji, tucked beside the busy Harajuku district."},
        {"name": "Tsukiji Outer Market", "description": "A bustling market street famous for fresh seafood, street food, and kitchen tools."},
        {"name": "Tokyo Skytree", "description": "One of the tallest towers in the world, offering panoramic views across the entire city."},
    ],
    "rome": [
        {"name": "Colosseum", "description": "The largest ancient amphitheater ever built, and the most iconic symbol of the Roman Empire."},
        {"name": "Vatican Museums & Sistine Chapel", "description": "An extraordinary collection of art culminating in Michelangelo's ceiling in the Sistine Chapel."},
        {"name": "Trevi Fountain", "description": "A baroque masterpiece where visitors traditionally toss a coin to ensure a return trip to Rome."},
        {"name": "Roman Forum", "description": "The sprawling ruins of ancient Rome's civic and political heart, next to the Colosseum."},
        {"name": "Pantheon", "description": "A remarkably preserved Roman temple with the world's largest unreinforced concrete dome."},
    ],
    "san francisco": [
        {"name": "Golden Gate Bridge", "description": "The iconic Art Deco suspension bridge and the defining image of San Francisco."},
        {"name": "Alcatraz Island", "description": "The former federal prison on an island in the bay, now a popular audio-guided tour."},
        {"name": "Fisherman's Wharf", "description": "A lively waterfront area known for sea lions, seafood, and views of the bay."},
        {"name": "Golden Gate Park", "description": "A massive urban park with gardens, museums, and a herd of bison near its western edge."},
        {"name": "Chinatown", "description": "The oldest Chinatown in North America, packed with markets, temples, and dumpling shops."},
    ],
    "barcelona": [
        {"name": "Sagrada Família", "description": "Gaudí's still-unfinished basilica, one of the most extraordinary buildings in the world."},
        {"name": "Park Güell", "description": "A whimsical public park designed by Gaudí, full of mosaic tilework and city views."},
        {"name": "La Rambla", "description": "A famous tree-lined pedestrian street running through the heart of the old city."},
        {"name": "Gothic Quarter", "description": "A maze of medieval streets and squares, the historic core of Barcelona."},
        {"name": "Casa Batlló", "description": "Another Gaudí masterpiece, a bone-and-scale-inspired building on Passeig de Gràcia."},
    ],
    "istanbul": [
        {"name": "Hagia Sophia", "description": "A former Byzantine cathedral and Ottoman mosque, one of the great architectural achievements in history."},
        {"name": "Blue Mosque", "description": "An active mosque famed for its cascading domes and six minarets."},
        {"name": "Grand Bazaar", "description": "One of the world's oldest and largest covered markets, with thousands of shops."},
        {"name": "Topkapi Palace", "description": "The former residence of Ottoman sultans, with opulent rooms and views over the Bosphorus."},
        {"name": "Bosphorus Strait", "description": "The waterway dividing Europe and Asia — best seen on a boat cruise at sunset."},
    ],
    "kyoto": [
        {"name": "Fushimi Inari Shrine", "description": "Famous for its thousands of vermilion torii gates winding up a forested mountain."},
        {"name": "Kinkaku-ji (Golden Pavilion)", "description": "A stunning gold-leaf-covered Zen temple reflected in a still pond."},
        {"name": "Arashiyama Bamboo Grove", "description": "A serene path through towering bamboo stalks on the city's western edge."},
        {"name": "Kiyomizu-dera", "description": "A historic wooden temple on a hillside with sweeping views over Kyoto."},
        {"name": "Gion District", "description": "Kyoto's famous geisha district, with preserved wooden teahouses and narrow lanes."},
    ],
    "dubai": [
        {"name": "Burj Khalifa", "description": "The tallest building in the world, with an observation deck offering desert-to-skyline views."},
        {"name": "Dubai Mall", "description": "One of the largest malls on Earth, with an aquarium, ice rink, and the Dubai Fountain outside."},
        {"name": "Palm Jumeirah", "description": "A man-made palm-shaped island lined with resorts and beach clubs."},
        {"name": "Dubai Desert", "description": "The dunes just outside the city, popular for safaris, dune bashing, and sunset camps."},
        {"name": "Al Fahidi Historical District", "description": "A preserved old quarter of wind-tower architecture, museums, and the historic creek."},
    ],
    "sydney": [
        {"name": "Sydney Opera House", "description": "The unmistakable sail-shaped icon of Australia, hosting world-class performances on the harbor."},
        {"name": "Sydney Harbour Bridge", "description": "A massive steel arch bridge that can be climbed for panoramic harbor views."},
        {"name": "Bondi Beach", "description": "Australia's most famous beach, backed by the scenic Bondi to Coogee coastal walk."},
        {"name": "The Rocks", "description": "Sydney's oldest neighborhood, with cobbled lanes, markets, and colonial-era buildings."},
        {"name": "Royal Botanic Garden", "description": "Lush gardens right on the harbor, with the best photo angle of the Opera House and bridge."},
    ],
    "bangkok": [
        {"name": "Grand Palace", "description": "A dazzling complex of ornate buildings that was once the residence of the Kings of Siam."},
        {"name": "Wat Arun", "description": "The 'Temple of Dawn', a striking riverside temple encrusted with porcelain and seashells."},
        {"name": "Chatuchak Weekend Market", "description": "One of the world's largest markets, with thousands of stalls selling everything imaginable."},
        {"name": "Wat Pho", "description": "Home to a giant 46-meter reclining Buddha and the birthplace of traditional Thai massage."},
        {"name": "Chao Phraya River", "description": "The river running through the city — best explored by longtail boat or river ferry."},
    ],
    "cairo": [
        {"name": "Pyramids of Giza", "description": "The last surviving wonder of the ancient world, alongside the Great Sphinx."},
        {"name": "Egyptian Museum", "description": "Home to an unrivaled collection of pharaonic antiquities, including Tutankhamun's treasures."},
        {"name": "Khan el-Khalili Bazaar", "description": "A centuries-old market maze of spices, lanterns, and handicrafts."},
        {"name": "Islamic Cairo", "description": "A historic district of medieval mosques, madrasas, and minarets."},
        {"name": "Nile River Corniche", "description": "The riverside promenade for a felucca sailboat ride at sunset."},
    ],
    "rio de janeiro": [
        {"name": "Christ the Redeemer", "description": "The towering statue atop Corcovado mountain, overlooking the whole city."},
        {"name": "Sugarloaf Mountain", "description": "A granite peak reached by cable car, with iconic views of Rio's coastline."},
        {"name": "Copacabana Beach", "description": "The world-famous curved beach lined with the promenade's black-and-white mosaic."},
        {"name": "Santa Teresa", "description": "A hillside bohemian neighborhood of cobbled streets, art studios, and colonial houses."},
        {"name": "Tijuca Forest", "description": "The world's largest urban rainforest, with waterfalls and hiking trails minutes from the city."},
    ],
    "amsterdam": [
        {"name": "Rijksmuseum", "description": "The Netherlands' national museum, home to Rembrandt's The Night Watch and Dutch Golden Age art."},
        {"name": "Anne Frank House", "description": "The preserved hiding place behind a canal house, telling the story of Anne Frank's diary."},
        {"name": "Canal Ring", "description": "The UNESCO-listed ring of 17th-century canals, best explored by boat or bike."},
        {"name": "Van Gogh Museum", "description": "The largest collection of Van Gogh's paintings and letters in the world."},
        {"name": "Jordaan District", "description": "A charming, quiet neighborhood of narrow streets, courtyards, and local cafes."},
    ],
    "berlin": [
        {"name": "Brandenburg Gate", "description": "The neoclassical monument that became a symbol of German reunification."},
        {"name": "Berlin Wall Memorial", "description": "A preserved stretch of the Wall with an outdoor exhibition on Cold War Berlin."},
        {"name": "Museum Island", "description": "A UNESCO World Heritage complex of five major museums on the Spree river."},
        {"name": "Reichstag Building", "description": "Germany's parliament building, topped by a glass dome open to visitors."},
        {"name": "East Side Gallery", "description": "The longest surviving section of the Berlin Wall, covered in murals by international artists."},
    ],
    "singapore": [
        {"name": "Gardens by the Bay", "description": "A futuristic park of Supertrees and climate-controlled biodomes."},
        {"name": "Marina Bay Sands SkyPark", "description": "An observation deck atop the iconic three-tower hotel, with an infinity pool view."},
        {"name": "Merlion Park", "description": "Home to Singapore's half-lion, half-fish mascot, overlooking Marina Bay."},
        {"name": "Chinatown", "description": "A heritage district of temples, shophouses, and hawker food stalls."},
        {"name": "Sentosa Island", "description": "A resort island with beaches, theme parks, and family attractions."},
    ],
    "hong kong": [
        {"name": "Victoria Peak", "description": "The highest point on Hong Kong Island, with the city's most famous skyline view."},
        {"name": "Star Ferry", "description": "The century-old harbor ferry connecting Hong Kong Island and Kowloon."},
        {"name": "Tian Tan Buddha", "description": "A giant bronze Buddha statue on Lantau Island, reached by cable car."},
        {"name": "Temple Street Night Market", "description": "A bustling night market known for street food, fortune tellers, and bargains."},
        {"name": "Man Mo Temple", "description": "One of Hong Kong's oldest temples, filled with giant hanging incense coils."},
    ],
    "mumbai": [
        {"name": "Gateway of India", "description": "A grand arch monument overlooking the Arabian Sea, built to commemorate a royal visit."},
        {"name": "Chhatrapati Shivaji Terminus", "description": "A UNESCO-listed Victorian Gothic railway station and architectural landmark."},
        {"name": "Marine Drive", "description": "A sweeping seafront promenade known as the 'Queen's Necklace' at night."},
        {"name": "Elephanta Caves", "description": "Ancient rock-cut cave temples dedicated to Shiva, on an island a short ferry ride away."},
        {"name": "Dhobi Ghat", "description": "The world's largest open-air laundry, a fascinating slice of everyday Mumbai life."},
    ],
    "los angeles": [
        {"name": "Hollywood Walk of Fame", "description": "Miles of terrazzo stars honoring entertainment icons, right in the heart of Hollywood."},
        {"name": "Griffith Observatory", "description": "A hilltop observatory with iconic views of the Hollywood Sign and the LA skyline."},
        {"name": "Santa Monica Pier", "description": "A classic beachfront pier with an amusement park and views down the California coast."},
        {"name": "Getty Center", "description": "A hilltop art museum with striking architecture, gardens, and free admission."},
        {"name": "Venice Beach Boardwalk", "description": "A famously eclectic beach strip of street performers, muscle beach, and canals."},
    ],
    "venice": [
        {"name": "St. Mark's Square", "description": "The grand civic heart of Venice, framed by the Basilica and the Campanile bell tower."},
        {"name": "Grand Canal", "description": "The city's main waterway, best experienced from a vaporetto or a classic gondola ride."},
        {"name": "Rialto Bridge", "description": "The oldest and most famous of the four bridges spanning the Grand Canal."},
        {"name": "Doge's Palace", "description": "The opulent former seat of Venetian government, connected to the infamous Bridge of Sighs."},
        {"name": "Murano Island", "description": "A short boat ride away, famous for centuries of hand-blown glass artistry."},
    ],
    "athens": [
        {"name": "Acropolis & Parthenon", "description": "The ancient citadel crowning Athens, home to the iconic Parthenon temple."},
        {"name": "Acropolis Museum", "description": "A modern museum built to showcase the treasures found on the Acropolis above."},
        {"name": "Ancient Agora", "description": "The marketplace and civic center of ancient Athens, birthplace of democracy."},
        {"name": "Plaka District", "description": "A picturesque old neighborhood of narrow lanes beneath the Acropolis."},
        {"name": "Temple of Olympian Zeus", "description": "The towering remains of what was once Greece's largest temple."},
    ],
}

for _alias, _target in ALIASES.items():
    CURATED.setdefault(_alias, CURATED.get(_target, []))

GENERIC_TEMPLATE = [
    ("Historic city center", "Wander the old town or historic core of {loc} — usually the best area for architecture, small shops, and getting a feel for the place."),
    ("Main market or square", "Seek out {loc}'s central market or main square, a reliable spot for people-watching, local food, and everyday life."),
    ("Leading museum or cultural site", "Look up {loc}'s top-rated museum or cultural landmark for a fast introduction to local history."),
    ("Scenic viewpoint or park", "Find a park, waterfront, or elevated viewpoint in {loc} for a good view and a break from the streets."),
    ("A signature local eatery", "Ask locals in {loc} for their favorite dish and where to get it — food is often the fastest way into a place."),
]


def _from_curated(key: str) -> list[PlaceSuggestion] | None:
    data = CURATED.get(key)
    if not data:
        return None
    return [PlaceSuggestion(name=d["name"], description=d["description"]) for d in data]


def _generic(location: str) -> list[PlaceSuggestion]:
    return [
        PlaceSuggestion(name=name, description=desc.format(loc=location.strip().title()), is_generic=True)
        for name, desc in GENERIC_TEMPLATE
    ]


def _from_llm(location: str) -> list[PlaceSuggestion] | None:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return None
    try:
        import anthropic
    except ImportError:
        return None
    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-sonnet-5",
            max_tokens=700,
            messages=[{
                "role": "user",
                "content": (
                    f"List exactly 5 real, well-known, verifiable places to visit in "
                    f"'{location}'. Respond with ONLY a JSON array (no markdown fences, "
                    f"no commentary) of 5 objects, each with keys 'name' and "
                    f"'description' (a single vivid sentence)."
                ),
            }],
        )
        text = "".join(block.text for block in message.content if hasattr(block, "text"))
        data = json.loads(text)
        return [PlaceSuggestion(name=d["name"], description=d["description"]) for d in data[:5]]
    except Exception:
        return None


def get_places(location: str) -> list[PlaceSuggestion]:
    """Return exactly 5 place suggestions for a location, trying live LLM,
    then the curated dataset, then a generic template — always succeeds."""
    llm_result = _from_llm(location)
    if llm_result:
        return llm_result

    key = _normalize(location)
    key = ALIASES.get(key, key)
    curated = _from_curated(key)
    if curated:
        return curated

    for name, places in CURATED.items():
        if name in key or key in name:
            return [PlaceSuggestion(name=d["name"], description=d["description"]) for d in places]

    return _generic(location)
