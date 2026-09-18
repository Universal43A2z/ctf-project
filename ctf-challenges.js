// ctf-challenges.js
// Capture The Flag challenge definitions
// All ciphertexts verified to decode to their flags.

const easy = [
  {
    id: 1,
    difficulty: "easy",
    title: "Base64 Bliss",
    points: 100,
    ciphertext: "ZmxhZ3tiYXNlNjRfaXNfYmFzaWN9",
    description:
      "Careless developers sometimes leave sensitive data encoded. This string is hiding something — can you reveal it?",
    hint: "Base64 is everywhere on the web. Any online decoder or a one-liner will do: `echo '...' | base64 -d`",
    flag: "flag{base64_is_basic}",
  },
  {
    id: 2,
    difficulty: "easy",
    title: "Hex Hunter",
    points: 100,
    ciphertext: "666c61677b6865785f69735f6e6561747d",
    description:
      "A packet capture dumped this data. It looks like bytes in their raw representation.",
    hint: "Each pair of characters is one byte. Use a hex decoder: `echo '...' | xxd -r -p`",
    flag: "flag{hex_is_neat}",
  },
  {
    id: 3,
    difficulty: "easy",
    title: "Shifting Shadows",
    points: 100,
    ciphertext: "gmbh{dbftbs_tijgu_pof}",
    description:
      "Julius Caesar used this trick to hide military messages. Someone shifted the alphabet by exactly one.",
    hint: "Shift every letter one position back in the alphabet.",
    flag: "flag{caesar_shift_one}",
  },
  {
    id: 4,
    difficulty: "easy",
    title: "Binary Basics",
    points: 100,
    ciphertext:
      "01100110 01101100 01100001 01100111 01111011 01100010 01101001 01101110 01100001 01110010 01111001 01011111 01100011 01101111 01100100 01100101 01110010 01111101",
    description:
      "Machines only speak two languages here: 0s and 1s. Translate this binary back into English.",
    hint: "Group each 8 bits (one byte) and convert to ASCII.",
    flag: "flag{binary_coder}",
  },
  {
    id: 5,
    difficulty: "easy",
    title: "Rotated Runes",
    points: 100,
    ciphertext: "synt{ebg13_sha}",
    description:
      "A simple rotation cipher that is its own inverse. Decode it to find the flag.",
    hint: "ROT13 rotates every letter by 13. Applying it twice gives you the original.",
    flag: "flag{rot13_fun}",
  },
  {
    id: 16,
    difficulty: "easy",
    title: "Octal Oasis",
    points: 100,
    ciphertext: "146 154 141 147 173 157 143 164 141 154 137 145 156 143 157 144 145 144 175",
    description:
      "Eight is enough for this number system. Each number is a byte written in base-8.",
    hint: "Octal escapes. Convert each 3-digit group (`printf '%b'`) into its character.",
    flag: "flag{octal_encoded}",
  },
  {
    id: 17,
    difficulty: "easy",
    title: "Base32 Beat",
    points: 100,
    ciphertext: "MZWGCZ33MJQXGZJTGJPXI2LNMV6Q====",
    description:
      "A cousin of base64 that uses the alphabet A-Z plus 2-7. Uppercase letters are the giveaway.",
    hint: "Base32 decoding. `base64 --decode` needs the --base32 flag, or use any base32 decoder.",
    flag: "flag{base32_time}",
  },
  {
    id: 18,
    difficulty: "easy",
    title: "Twin Towers",
    points: 100,
    ciphertext: "Wm14aFozdGtiM1ZpYkdWZlltRnpaVFkwZlE9PQ==",
    description:
      "This one is encoded not once, but twice. Peel one layer and you will find another.",
    hint: "Base64 right about now. Decode it, then decode again.",
    flag: "flag{double_base64}",
  },
  {
    id: 19,
    difficulty: "easy",
    title: "Backwards Blvd",
    points: 100,
    ciphertext: "}selur_esrever{galf",
    description:
      "Read it the way a mirror reads it. Sometimes the simplest hiding spot is the best.",
    hint: "Reverse the string.",
    flag: "flag{reverse_rules}",
  },
  {
    id: 20,
    difficulty: "easy",
    title: "Rotated Rodeo",
    points: 100,
    ciphertext: "7=28LC@Ecf04:A96CN",
    description:
      "A rotation cipher that works on the whole printable ASCII range instead of just letters.",
    hint: "ROT47: shift printable ASCII characters (33-126) by 47.",
    flag: "flag{rot47_cipher}",
  },
  {
    id: 37,
    difficulty: "easy",
    title: "Cat's Paw",
    points: 100,
    ciphertext: `ephraim hotel siegmund zulu oscar india quebec mike romeo ephraim norbert ottilia mike lorenz
gunnar roswitha lima dorcas ephraim lima papa joachim zulu quintus bernard
norbert mike konrad aurelia florent golf sierra petron delta
lima dorcas ottilia mike joachim norbert hotel siegmund joachim echo camille quebec lima xray
siegmund zulu marius zulu golf november sigma xray konrad gunnar mike hannelore mike papa montana
ephraim bernard quebec norbert florent hotel echo lima
romeo ottilia florent quebec camille konrad echo quebec siegmund papa siegmund gunnar november kilo november
yankee zulu zulu gunnar papa lima petron aurelia lorenz oscar
november dorcas zulu alpha marius yankee delta roswitha echo bernard lima ephraim
bernard florent ephraim gunnar dorcas ottilia mike zulu golf dorcas florent isaac oscar montana
montana kilo aurelia lima india ephraim yankee isaac mike isaac gunnar
alpha marius yankee aurelia konrad ottilia quebec romeo hannelore yankee gunnar xray
ephraim siegmund isaac hotel ephraim bernard hotel camille delta camille yankee hotel
romeo gunnar oscar gunnar camille florent delta november marius ottilia
delta norbert montana xray marius isaac lima romeo gunnar joachim petron
siegmund yankee hotel sigma kilo montana alpha roswitha golf echo gunnar montana dorcas petron roswitha quintus
hotel kilo florent florent zulu romeo joachim bernard quebec quebec isaac ephraim
petron zulu dorcas romeo lima sierra joachim quintus ephraim zulu konrad quintus konrad xray
ottilia india joachim norbert delta november bernard lorenz alpha
delta quintus ottilia sierra delta roswitha aurelia gunnar romeo xray quebec roswitha echo
golf echo bernard marius oscar petron yankee xray isaac echo gunnar oscar hotel november
xray sierra sierra dorcas alpha petron hotel petron zulu camille ottilia mike november quebec quebec
ottilia mike golf marius ephraim xray camille oscar siegmund xray
echo bernard hannelore hotel montana zulu november papa lorenz norbert delta oscar ephraim
india quintus isaac siegmund mike xray xray isaac dorcas
aurelia roswitha golf roswitha florent sigma montana xray quebec delta yankee petron
yankee november lorenz hannelore alpha golf camille xray siegmund aurelia bernard aurelia
ephraim sierra oscar petron papa sigma yankee florent
marius oscar zulu norbert gunnar echo lima india romeo xray quintus kilo hannelore delta
hotel quebec zulu montana echo romeo zulu roswitha
papa delta golf marius florent isaac alpha xray roswitha oscar bernard hannelore quebec konrad
dorcas marius xray oscar quintus lorenz lima kilo hannelore
zulu quebec konrad india zulu romeo xray norbert marius ottilia alpha
india norbert oscar gunnar florent norbert petron alpha india romeo aurelia
lorenz hotel kilo sigma golf hannelore echo aurelia hotel echo yankee zulu sierra
delta quintus norbert yankee hotel dorcas november xray camille ephraim papa montana
romeo hotel isaac echo sigma camille oscar papa siegmund mike ephraim sigma camille aurelia ephraim india
papa alpha sigma sigma zulu lima oscar bernard romeo alpha delta hannelore november hannelore mike dorcas FLAGHERE flag{cat_paw_grep}
hannelore petron ephraim petron romeo aurelia camille november sierra norbert india alpha golf oscar sierra
kilo sierra montana india lima isaac isaac norbert sigma siegmund romeo alpha ephraim
sigma yankee lorenz isaac hannelore aurelia marius india siegmund
kilo yankee florent lima alpha roswitha sierra joachim lorenz bernard siegmund mike sigma echo quintus mike
gunnar hotel hannelore roswitha roswitha sigma sigma november aurelia lima
kilo delta hannelore yankee zulu quebec yankee zulu gunnar kilo montana
gunnar ephraim kilo alpha sierra norbert montana romeo xray sierra
golf siegmund alpha romeo konrad florent quebec yankee siegmund
lima marius montana isaac romeo marius romeo zulu joachim yankee papa hotel bernard marius quebec
oscar camille siegmund norbert alpha oscar petron hannelore papa quintus delta bernard florent roswitha mike delta
mike hannelore joachim kilo mike delta hotel mike india montana hotel november papa romeo
zulu petron hotel mike november aurelia sigma lima montana florent bernard marius
isaac romeo konrad ottilia camille lima camille quebec
aurelia petron oscar lima norbert siegmund hannelore konrad
siegmund camille petron zulu norbert ottilia montana sigma sigma siegmund
papa quebec hannelore golf alpha ottilia aurelia petron yankee dorcas zulu petron bernard
petron yankee golf bernard hannelore hotel xray golf zulu
konrad florent hannelore ottilia ottilia ephraim dorcas roswitha ephraim
kilo lima camille quebec alpha romeo kilo delta dorcas ephraim aurelia roswitha
roswitha november siegmund yankee sierra gunnar quebec quebec quebec yankee sigma
marius ottilia romeo papa india gunnar norbert petron quebec romeo montana hannelore ephraim mike camille sigma
oscar konrad alpha lorenz montana india marius golf quebec joachim alpha camille petron quebec camille`,
    description:
      "A wall of text was dumped from a log. The flag is hiding on exactly one line somewhere inside it.",
    hint: "Save the text to a file (or pipe it) and use a filter: `cat log.txt | grep flag`",
    flag: "flag{cat_paw_grep}",
  },
  {
    id: 38,
    difficulty: "easy",
    title: "Pipe Power",
    points: 100,
    ciphertext: "==QfyV2dvB3XlBXawt3ZhxmZ",
    description:
      "This string has been run through two classic commands back to back. Get it back with a reversed pipeline.",
    hint: "It was reversed, then base64-encoded — so undo it in reverse order: `cat pipe.txt | rev | base64 -d`",
    flag: "flag{pipe_power}",
  },
  {
    id: 42,
    difficulty: "easy",
    title: "Line Ninja",
    points: 100,
    ciphertext: `log entry 1: op=idle status=ok ts=0000
log entry 2: op=idle status=ok ts=0001
log entry 3: op=idle status=ok ts=0002
log entry 4: op=idle status=ok ts=0003
log entry 5: op=idle status=ok ts=0004
log entry 6: op=idle status=ok ts=0005
log entry 7: op=idle status=ok ts=0006
log entry 8: op=idle status=ok ts=0007
log entry 9: op=idle status=ok ts=0008
log entry 10: op=idle status=ok ts=0009
log entry 11: op=idle status=ok ts=0010
log entry 12: op=idle status=ok ts=0011
log entry 13: op=idle status=ok ts=0012
log entry 14: op=idle status=ok ts=0013
log entry 15: op=idle status=ok ts=0014
log entry 16: op=idle status=ok ts=0015
log entry 17: op=idle status=ok ts=0016
log entry 18: op=idle status=ok ts=0017
log entry 19: op=idle status=ok ts=0018
log entry 20: op=idle status=ok ts=0019
log entry 21: op=idle status=ok ts=0020
log entry 22: op=idle status=ok ts=0021
log entry 23: op=idle status=ok ts=0022
log entry 24: op=idle status=ok ts=0023
log entry 25: op=idle status=ok ts=0024
log entry 26: op=idle status=ok ts=0025
log entry 27: op=idle status=ok ts=0026
log entry 28: op=idle status=ok ts=0027
log entry 29: op=idle status=ok ts=0028
log entry 30: op=idle status=ok ts=0029
log entry 31: op=idle status=ok ts=0030
log entry 32: op=idle status=ok ts=0031
log entry 33: op=idle status=ok ts=0032
log entry 34: op=idle status=ok ts=0033
log entry 35: op=idle status=ok ts=0034
log entry 36: op=idle status=ok ts=0035
log entry 37: op=idle status=ok ts=0036
log entry 38: op=idle status=ok ts=0037
log entry 39: op=idle status=ok ts=0038
log entry 40: op=idle status=ok ts=0039
log entry 41: op=idle status=ok ts=0040
log entry 42: op=idle status=ok ts=0041
log entry 43: op=idle status=ok ts=0042
log entry 44: op=idle status=ok ts=0043
log entry 45: op=idle status=ok ts=0044
log entry 46: op=idle status=ok ts=0045
log entry 47: op=idle status=ok ts=0046
log entry 48: op=idle status=ok ts=0047
log entry 49: op=idle status=ok ts=0048
log entry 50: op=idle status=ok ts=0049
log entry 51: op=idle status=ok ts=0050
log entry 52: op=idle status=ok ts=0051
log entry 53: op=idle status=ok ts=0052
log entry 54: op=idle status=ok ts=0053
log entry 55: op=idle status=ok ts=0054
log entry 56: op=idle status=ok ts=0055
log entry 57: op=idle status=ok ts=0056
log entry 58: op=idle status=ok ts=0057
log entry 59: op=idle status=ok ts=0058
log entry 60: op=idle status=ok ts=0059
log entry 61: op=idle status=ok ts=0060
log entry 62: op=idle status=ok ts=0061
log entry 63: op=idle status=ok ts=0062
log entry 64: op=idle status=ok ts=0063
log entry 65: op=idle status=ok ts=0064
log entry 66: op=idle status=ok ts=0065
log entry 67: op=idle status=ok ts=0066
log entry 68: op=idle status=ok ts=0067
log entry 69: op=idle status=ok ts=0068
log entry 70: op=idle status=ok ts=0069
log entry 71: op=idle status=ok ts=0070
log entry 72: op=idle status=ok ts=0071
log entry 73: op=idle status=ok ts=0072
log entry 74: op=idle status=ok ts=0073
log entry 75: op=idle status=ok ts=0074
log entry 76: op=idle status=ok ts=0075
log entry 77: op=idle status=ok ts=0076
log entry 78: op=idle status=ok ts=0077
log entry 79: op=idle status=ok ts=0078
log entry 80: op=idle status=ok ts=0079
log entry 81: op=idle status=ok ts=0080
log entry 82: op=idle status=ok ts=0081
log entry 83: op=idle status=ok ts=0082
log entry 84: op=idle status=ok ts=0083
log entry 85: op=idle status=ok ts=0084
log entry 86: op=idle status=ok ts=0085
log entry 87: op=idle status=ok ts=0086
log entry 88: op=secret status=found FLAG HERE flag{say_my_name}
log entry 89: op=idle status=ok ts=0088
log entry 90: op=idle status=ok ts=0089
log entry 91: op=idle status=ok ts=0090
log entry 92: op=idle status=ok ts=0091
log entry 93: op=idle status=ok ts=0092
log entry 94: op=idle status=ok ts=0093
log entry 95: op=idle status=ok ts=0094
log entry 96: op=idle status=ok ts=0095
log entry 97: op=idle status=ok ts=0096
log entry 98: op=idle status=ok ts=0097
log entry 99: op=idle status=ok ts=0098
log entry 100: op=idle status=ok ts=0099`,
    description:
      "A system log with one hundred entries. The flag was logged on exactly one specific line — but the logs are long. Extract just that line.",
    hint: "Jump straight to the line: `sed -n '88p' log.txt` — or `cat log.txt | head -n 88 | tail -n 1`",
    flag: "flag{say_my_name}",
  },
  {
    id: 43,
    difficulty: "easy",
    title: "Echo Chamber",
    points: 100,
    ciphertext: "knock knock who is there",
    description:
      "The flag is not in this text — it is a fingerprint of this text. One-way hashing turns this exact message into the flag.",
    hint: "`printf '%s' \"knock knock who is there\" | sha256sum` — the first 8 hex chars of the digest are the answer, wrapped as flag{...}. (No trailing newline!)",
    flag: "flag{df478e0f}",
  },
];

const medium = [
  {
    id: 6,
    difficulty: "medium",
    title: "Exclusive Encoding",
    points: 250,
    ciphertext: "4c 46 4b 4d 51 52 45 58 75 43 59 75 59 5f 5a 4f 58 57",
    description:
      "Each byte was XORed with a single secret key. If you guess the key, the message unravels.",
    hint: "XOR is reversible: ciphertext XOR key = plaintext. The key for this one is 0x2A.",
    flag: "flag{xor_is_super}",
  },
  {
    id: 7,
    difficulty: "medium",
    title: "URL Obfuscation",
    points: 250,
    ciphertext: "%66%6C%61%67%7B%75%72%6C%5F%65%6E%63%6F%64%65%64%7D",
    description:
      "This looks like the inside of a browser address bar. Every character is percent-encoded.",
    hint: "Percent-encoding (URL encoding) uses %00 for bytes — each `%XX` is one character.",
    flag: "flag{url_encoded}",
  },
  {
    id: 8,
    difficulty: "medium",
    title: "Polyalphabetic Puzzle",
    points: 250,
    ciphertext: "ppyq{zgqilovc_mvwzxm}",
    description:
      "Unlike a Caesar shift, this cipher cycles through multiple shifts using a repeating keyword.",
    hint: "Vigenere cipher. The keyword is KEY.",
    flag: "flag{vigenere_crypto}",
  },
  {
    id: 9,
    difficulty: "medium",
    title: "Mirror Mirror",
    points: 250,
    ciphertext: "uozt{zgyzhs_rh_ufm}",
    description:
      "The alphabet has been flipped — A is now Z, B is now Y. A perfect mirror of itself.",
    hint: "Atbash cipher: a->z, b->y, c->x ... z->a.",
    flag: "flag{atbash_is_fun}",
  },
  {
    id: 10,
    difficulty: "medium",
    title: "Dot Dot Dash",
    points: 250,
    ciphertext:
      "..-. / .-.. / .- / --. / -.-.-- / -- / --- / .-. / ... / . / ..--.- / ... / .. / --. / -. / .- / .-.. / ... / .-.--.-",
    description:
      "An old-timey way of signaling. Decode the beeps to get the message.",
    hint: "Morse code. `{` is -.-.--, `}` is .-.--.-, and `_` is ..--.-. Letters are separated by `/`.",
    flag: "flag{morse_signals}",
  },
  {
    id: 21,
    difficulty: "medium",
    title: "Shift Seven",
    points: 250,
    ciphertext: "mshn{zopma_zlclu_alza}",
    description:
      "A single Caesar shift guards this message. The shift is not 1 this time — it is seven.",
    hint: "Every letter is shifted 7 positions. Shift them 7 back.",
    flag: "flag{shift_seven_test}",
  },
  {
    id: 22,
    difficulty: "medium",
    title: "XOR Keychain",
    points: 250,
    ciphertext: "2d 29 38 2c 3e 21 24 37 06 20 20 20 28 2d 38 22 2b 24",
    description:
      "A repeating XOR key scrambles this message. The key cycles K-E-Y over and over.",
    hint: "XOR each byte with the next letter of KEY: K, E, Y, K, E, Y...",
    flag: "flag{xor_keychain}",
  },
  {
    id: 23,
    difficulty: "medium",
    title: "Affine Alchemy",
    points: 250,
    ciphertext: "hlim{ihhwvc_pasgu}",
    description:
      "A more mathematical encryption: each letter is mapped by y = (a*x + b) mod 26. Here a=5 and b=8.",
    hint: "Affine cipher. The modular inverse of 5 (mod 26) is 21. Decrypt with x = 21*(y-8) mod 26.",
    flag: "flag{affine_rocks}",
  },
  {
    id: 24,
    difficulty: "medium",
    title: "Two Rail Tram",
    points: 250,
    ciphertext: "fa{w_alfnelgtori_ec}",
    description:
      "The message was written along just two rails of a fence. Odd letters then even letters.",
    hint: "Rail fence with 2 rails: take one-half and interleave with the other.",
    flag: "flag{two_rail_fence}",
  },
  {
    id: 25,
    difficulty: "medium",
    title: "Progressive Path",
    points: 250,
    ciphertext: "fmcj{uxvoaodevjt_dgoy}",
    description:
      "Each letter was shifted by a growing amount: the first letter by 0, the second by 1, and so on.",
    hint: "Progressive Caesar. Letter at position i was shifted +i; shift it back by i.",
    flag: "flag{progressive_move}",
  },
  {
    id: 31,
    difficulty: "medium",
    title: "Tunnel Vision",
    points: 250,
    ciphertext: "MZWGCZ33.MRXHGX3F.PBTGS3D5",
    description:
      "A packet capture shows DNS queries against exfil.test. The subdomain labels were used to smuggle data out of the network. Combine the labels and decode.",
    hint: "The three labels are one base32 string split by dots. Concatenate them, re-add = padding, then base32-decode.",
    flag: "flag{dns_exfil}",
  },
  {
    id: 32,
    difficulty: "medium",
    title: "Whitespace Whisper",
    points: 250,
    ciphertext:
      "lorem  \t\t  \t\t \nipsum  \t\t \t\t  \ndolor  \t\t    \t\nsit  \t\t  \t\t\t\namet  \t\t\t\t \t\t\nconsec  \t\t\t \t\t\t\nadip  \t\t \t   \nvelit  \t\t \t  \t\neuism  \t\t\t \t  \nnulla  \t\t  \t \t\nmassa  \t\t\t  \t\t\nquam  \t\t\t    \njusto  \t\t    \t\ndonec  \t\t   \t\t\nfring  \t\t  \t \t\nmollis  \t \t\t\t\t\t\nsapien  \t\t \t\t \t\nproin  \t\t    \t\nat  \t\t  \t\t\t\nfelis  \t\t \t  \t\nodio  \t\t   \t\t\nluctus  \t\t\t\t\t \t",
    description:
      "This file looks like a list of filler words, but something is hidden in the whitespace. Every line ends with trailing invisible characters.",
    hint: "Inspect with `cat -A` or a hex editor: each line ends with exactly 8 spaces (0) or tabs (1), most-significant bit first. Every 8 count for one ASCII character.",
    flag: "flag{whitespace_magic}",
  },
  {
    id: 33,
    difficulty: "medium",
    title: "Pixel Peeker",
    points: 250,
    ciphertext:
      "142 207 207 172 222 155 221 230 146 228 235 161 100 103 195 208 117 136 158 158 110 211 205 212 109 185 239 226 128 195 105 138 123 131 104 217 141 187 203 224 138 146 108 220 161 119 151 152 119 130 220 199 150 187 137 236 204 174 192 215 229 199 181 224 199 168 107 122 140 227 101 224 116 240 233 157 180 129 147 142 189 185 189 179 163 126 143 116 144 208 194 140 109 233 161 204 141 102 189 224 228 197 163 162 141 116 213 204 222 115 173 112 167 175 108 207 162 143 201 116 187 136 139 223 113 165 135 234",
    description:
      "The last 8 bytes of a BMP file decode to the flag. Each decimal value is a pixel byte; its least significant bit carries part of the hidden message.",
    hint: "Take the parity (odd/even) of each number: odd=1, even=0. Group 8 bits per character, least-significant bit first.",
    flag: "flag{pixel_peek}",
  },
  {
    id: 35,
    difficulty: "medium",
    title: "Roman Clock",
    points: 250,
    ciphertext: "CII CVIII XCVII CIII CXXIII CXIV CXI CIX XCVII CX XCV XCIX CVIII CXI XCIX CVII CXXV",
    description:
      "An ancient numeral system was used to spell out this flag. Convert each Roman numeral to a number, then to its ASCII character.",
    hint: "CI=101, CVIII=108 ... every value is an ASCII code.",
    flag: "flag{roman_clock}",
  },
  {
    id: 36,
    difficulty: "medium",
    title: "QWERTY Drift",
    points: 250,
    ciphertext: "g;sh{wertyu_djogy}",
    description:
      "This message was typed with every key offset by one position to the right. Shift the letters back to the left on the keyboard to recover the flag.",
    hint: "On a QWERTY layout: g->f, ;->l, s->a, h->g ... (the typist meant to type 'f' but hit 'g').",
    flag: "flag{qwerty_shift}",
  },
  {
    id: 39,
    difficulty: "medium",
    title: "Read The Signs",
    points: 250,
    ciphertext: `7f454c46e7eee7615ef35f30e49b482e15cae75007201e12617b0feda7e1647796ff022bea8ed02a82a175930f2337cd3794c52208006d6b1af0c0cbd625658aac2c9faa07d13c447e33051eeef95a60e56143d6c43bcad76c008a9b0a6b5fc933154a6de28404a897c525262e6a7c07bcbee841f745c55d4e9f747f666c61677b7878645f737472696e67737d5164c6282d617ac86c627c4067253a2359254f4331a947094d117128a329652542ae7729d50f07c321292ed5c6ea65616c22796ef8213267afe23e757139c44831258d3943d36248e7246d7a4d683138`,
    description:
      "This is the raw hex dump of an actual binary file. Rebuild the binary from the hex, then hunt for readable strings buried inside it.",
    hint: "Recreate the file with `cat dump.hex | xxd -r -p > binfile`, then scan it for printable text: `strings binfile | grep flag{`",
    flag: "flag{xxd_strings}",
  },
  {
    id: 40,
    difficulty: "medium",
    title: "Column Crunch",
    points: 250,
    ciphertext: `id,name,note,price
1,sigma.corp,steel,$46.99
2,golf.corp,amber,$24.99
3,echo.corp,cobalt,$55.99
4,alpha.corp,rust,$88.99
5,mike.corp,ivory,$11.99
6,kilo.corp,stone,$14.99
7,november.corp,emerald,$73.99
8,quebec.corp,graphite,$17.99
9,papa.corp,onyx,$51.99
10,xray.corp,pearl,$79.99
11,zulu.corp,jade,$12.99
12,hotel.corp,slate,$69.99
13,lima.corp,ucn,$32.99
14,oscar.corp,wisp,$9.99
15,india.corp,fern,$16.99
16,romeo.corp,moss,$60.99
17,omega.corp,flag{cut_column_game},$42.42
18,yankee.corp,leaf,$13.99
19,montana.corp,tide,$35.99
20,aurelia.corp,reef,$16.99
21,bernard.corp,dune,$75.99
22,camille.corp,gale,$59.99
23,dorcas.corp,mist,$12.99
24,ephraim.corp,lemon,$77.99
25,florent.corp,steel,$20.99
26,gunnar.corp,amber,$33.99
27,hannelore.corp,cobalt,$85.99
28,isaac.corp,rust,$85.99
29,joachim.corp,ivory,$79.99
30,konrad.corp,stone,$12.99`,
    description:
      "A database export in CSV format. The flag was recorded in one specific column of one row. Pull out that column and search it.",
    hint: "Split on commas and grab the note field: `cat sales.csv | cut -d',' -f3 | grep flag`",
    flag: "flag{cut_column_game}",
  },
  {
    id: 41,
    difficulty: "medium",
    title: "Sole Survivor",
    points: 250,
    ciphertext: `tx-8456-bb
tx-8550-ee
tx-8330-ff
tx-8456-bb
tx-8890-gg
tx-8777-cc
tx-8001-hh
tx-8001-hh
tx-8180-dd
tx-8777-cc
tx-8123-aa
tx-8123-aa
tx-8180-dd
tx-8123-aa
tx-8180-dd
tx-8890-gg
tx-8550-ee
tx-8330-ff
tx-8001-hh
tx-8456-bb
tx-8180-dd
tx-8001-hh
tx-8890-gg
flag{sort_uniq_unique}
tx-8550-ee
tx-8890-gg
tx-8777-cc
tx-8777-cc
tx-8330-ff`,
    description:
      "A transaction ledger. Every entry was logged multiple times — except one. Find the entry that appears exactly once.",
    hint: "Sort it and list only the lines that occur once: `sort ledger.txt | uniq -u`",
    flag: "flag{sort_uniq_unique}",
  },
  {
    id: 44,
    difficulty: "medium",
    title: "Field Day",
    points: 250,
    ciphertext: `K10 f
K11 l
K12 a
K13 g
K14 {
K15 a
K16 w
K17 k
K18 _
K19 f
K20 i
K21 e
K22 l
K23 d
K24 s
K25 }`,
    description:
      "Each line is a record with two fields. The flag is hiding in one of the columns — extract that field from every record and join them together.",
    hint: "Print the second field of each line and glue the results: `cat fields.txt | awk '{print $2}' | tr -d '\\n'`",
    flag: "flag{awk_fields}",
  },
  {
    id: 45,
    difficulty: "medium",
    title: "First Packet",
    points: 250,
    ciphertext: "",
    description:
      "Open-Source Intelligence challenge. Decades before the public Internet, the very first host-to-host message was sent on this network. You are researching a piece of Internet history — no flag is provided, you must find this year yourself.",
    hint: "Kleinrock's lab, UCLA. Who connected on October 29, 1969? Work out the year the ARPANET's first message was transmitted.",
    flag: "flag{arpanet_1969}",
  },
  {
    id: 46,
    difficulty: "medium",
    title: "RFC Teller",
    points: 250,
    ciphertext: "",
    description:
      "OSINT — Standards diving. The encoding scheme behind this very website's base64 challenges is defined by a Request for Comments document. Go find the RFC number that formally specifies Base64 encoding.",
    hint: "RFC 4648 is titled 'The Base16, Base32, and Base64 Data Encodings' from October 2006.",
    flag: "flag{rfc4648}",
  },
  {
    id: 47,
    difficulty: "medium",
    title: "WWW Century",
    points: 250,
    ciphertext: "",
    description:
      "OSINT — The web itself. A single proposal named 'Information Management: A Proposal' planted the seed for the World Wide Web. When was that proposal written by its author at CERN?",
    hint: "Tim Berners-Lee wrote the proposal in March 1989 — the year the WWW was conceived.",
    flag: "flag{www_proposal_1989}",
  },
  {
    id: 48,
    difficulty: "medium",
    title: "Magic Numbers",
    points: 250,
    ciphertext: "File signatures (magic bytes) in hex:\n\n89 50 4E 47 0D 0A 1A 0A\n7F 45 4C 46\nFF D8 FF E0\n25 50 44 46\n50 4B 03 04\nEF BB BF\n47 49 46 38 37 61\n1F 8B 08 00",
    description:
      "Forensics — File identification. Every file format starts with specific magic bytes that mark its type. Identify what format this signature belongs to: 89 50 4E 47 0D 0A 1A 0A",
    hint: "These are the magic bytes of a PNG image: 89 50 4E 47 = '.PNG'. The PNG signature appears in every PNG file header.",
    flag: "flag{png}",
  },
  {
    id: 49,
    difficulty: "medium",
    title: "Acrostic Muse",
    points: 250,
    ciphertext: `find the edges where lines begin,
look at the very first character,
always note how the text is written,
gather each lead and carry it farther,
{ then the left edge begins to sing,
a careful reader pulls one string,
count the starts, collect from every verse,
read them top to bottom, line by line,
once assembled the words align,
start where stanza one began,
tag each first bird as it sails,
in the margin, onboard the plan,
conclude the flag from these details,
_ underscore bridges what came before,
move through the lines in careful rank,
unless you rush, you'll brace for more,
spell the secret, never blank,
each vignette ends with the flag, at last:
} that is the message — plain and vast,`,
    description:
      "Steganography — concealment inside plain text. A poem carries a secret: the flag is woven into the text itself, not hidden by scrambling but by arrangement. The first letter of every line spells it out.",
    hint: "Take the first character of each line, top to bottom, and read them together.",
    flag: "flag{acrostic_muse}",
  },
  {
    id: 50,
    difficulty: "medium",
    title: "Exif Extra",
    points: 250,
    ciphertext: `Filename    : sunset_2014.jpg
Make        : Canon
Model       : Canon EOS 1100D
Software    : GIMP 2.10.20
Date taken  : 2014:07:19 18:31:02
Artist      : flag{exif_extra}
GPS Latitude: 51° 30' 26.5" N
Resolution  : 1200 x 800
`,
    description:
      "Forensics — Metadata. Digital photos hide a treasure trove of metadata in EXIF: the camera, settings, even the location. This dumped metadata block came straight from an image — what did the photographer leave behind?",
    hint: "Look at the EXIF fields — the Artist tag often records the author. The flag is in one of those metadata fields.",
    flag: "flag{exif_extra}",
  },
  {
    id: 51,
    difficulty: "medium",
    title: "Droids of Robots",
    points: 250,
    ciphertext: `User-agent: *
Disallow: /admin/
Disallow: /.git/
Disallow: /backup/
Disallow: /secrets/recipe.txt
# Automated scanners read this file first.
# Anything disallowed here is exactly what you should visit.
`,
    description:
      "Web — Robots exclusión. Before indexing a site, search engines download robots.txt to learn what is off-limits. Everything disallowed here is exactly what an attacker would visit. Reach the forbidden path.",
    hint: "The disallowed path /secrets/recipe.txt is the prize. Go where robots tells you not to.",
    flag: "flag{robots_txt_probe}",
  },
  {
    id: 52,
    difficulty: "medium",
    title: "Header Herald",
    points: 250,
    ciphertext: `HTTP/1.1 200 OK
Server: nginx/1.24.0
Content-Type: text/html
Strict-Transport-Security: max-age=31536000
X-Flag: flag{headers_reveal}
Via: 1.1 vegur
`,
    description:
      "Web — Response headers. Servers announce far more than the page body — custom and standard headers can leak sensitive data. This HTTP response hid something in a non-standard header.",
    hint: "Custom 'X-' headers are a common hiding spot for server authors. Inspect every header, not just the body.",
    flag: "flag{headers_reveal}",
  },
  {
    id: 53,
    difficulty: "medium",
    title: "API Oracle",
    points: 250,
    ciphertext: `GET /api/v2/users/1234  HTTP/1.1
Accept: application/json


HTTP/1.1 200 OK
Content-Type: application/json

{ "id": 1234, "email": "admin@ctf.io", "role": "superuser", "session_token": "flag{api_bug_lab}", "2fa_enabled": false }`,
    description:
      "Web — API exposure. A misconfigured endpoint returned the full record of an admin account, including fields it should never leak. Inspect the JSON response body carefully.",
    hint: "Objects returned by APIs can include sensitive fields beyond what the UI shows. Read the full JSON.",
    flag: "flag{api_bug_lab}",
  },
  {
    id: 54,
    difficulty: "easy",
    title: "Unzip The Truth",
    points: 100,
    ciphertext: "",
    file: { name: "suspicious.zip", size: 291 },
    description:
      "Forensics — Download the archive attached to this challenge. It was silently downloaded by a scanner and flagged as suspicious. Open it up — what did the file inside contain?",
    hint: "`unzip suspicious.zip` then read whatever comes out: `cat flag.txt`.",
    flag: "flag{beware_zip_bombs}",
  },
  {
    id: 55,
    difficulty: "medium",
    title: "Picture This",
    points: 250,
    ciphertext: "",
    file: { name: "selfie.png", size: 106 },
    description:
      "Forensics — Download this image. A photo can carry hidden text where it is never rendered on screen — in its metadata and file structure. Pull the extra bytes out of this PNG.",
    hint: "Scan the image's raw bytes for printable text: `strings selfie.png`, or read its metadata with an EXIF tool.",
    flag: "flag{png_comment}",
  },
  {
    id: 56,
    difficulty: "easy",
    title: "Payload Manifest",
    points: 100,
    ciphertext: "",
    file: { name: "manifest.csv", size: 557 },
    description:
      "General Skills — Download the CSV manifest. One column of this dispatch table marks the status of each payload, and one entry in it is not a status at all. Pull the right column and scan it.",
    hint: "`cat manifest.csv | cut -d',' -f3 | grep flag` — field 3 is the verdict column.",
    flag: "flag{manifest_csv}",
  },
  {
    id: 57,
    difficulty: "medium",
    title: "Binary Whisperer",
    points: 250,
    ciphertext: "",
    file: { name: "payload.bin", size: 185 },
    description:
      "Forensics — Download this binary blob. The flag lives somewhere inside these raw bytes, hidden among unreadable data. Extract any human-readable strings that survive inside it.",
    hint: "`strings payload.bin | grep flag{` — printable characters hiding in binary data.",
    flag: "flag{binary_whispers}",
  },
  {
    id: 58,
    difficulty: "easy",
    title: "Buried Ledger",
    points: 100,
    ciphertext: "",
    file: { name: "system.log", size: 9904 },
    description:
      "General Skills — Download this system log. Hundreds of routine entries, and exactly one of them records something that should never have been logged. Find the line that stands out.",
    hint: "Search the whole file: `cat system.log | grep flag`. One line out of two hundred is the prize.",
    flag: "flag{log_grep_hunt}",
  },
];

const hard = [
  {
    id: 11,
    difficulty: "hard",
    title: "Stacked Secrets",
    points: 500,
    ciphertext:
      "4d4445784d4441784d5441674d4445784d4445784d4441674d4445784d4441774d4445674d4445784d4441784d5445674d4445784d5445774d5445674d4445784d4445784d4441674d4445784d4441774d4445674d4445784d5445774d4445674d4445784d4441784d4445674d4445784d5441774d5441674d4445784d5441774d5445674d4445774d5445784d5445674d4445784d4441784d4441674d4445784d4441784d4445674d4445784d4441784d4445674d4445784d5441774d4441674d4445784d5445784d44453d",
    description:
      "This flag was encoded three times in a row. Decode it layer by layer — each layer is a different encoding.",
    hint: "Layer 1: hex. Layer 2: base64. Layer 3: binary.",
    flag: "flag{layers_deep}",
  },
  {
    id: 12,
    difficulty: "hard",
    title: "Grid Mapping",
    points: 500,
    ciphertext:
      "21 31 11 22 { 35 34 31 54 12 24 45 43 _ 43 41 45 11 42 15 _ 53 54 }",
    description:
      "Pairs of digits map to letters on a 5x5 grid. Each pair is row,column counting from 1.",
    hint: "Polybius square with the alphabet 'abcdefghiklmnopqrstuvwxyz' (i/j combined).",
    flag: "flag{polybius_square_xy}",
  },
  {
    id: 13,
    difficulty: "hard",
    title: "Rail Fence",
    points: 500,
    ciphertext: "f{lntelgri_ec_he}aafer",
    description:
      "The message was written on a zigzag fence and read off row by row.",
    hint: "Rail Fence cipher with 3 rails. Write the ciphertext into the zigzag pattern.",
    flag: "flag{rail_fence_three}",
  },
  {
    id: 14,
    difficulty: "hard",
    title: "Bacon Platine",
    points: 500,
    ciphertext:
      "AABAB ABABB AAAAA AABBA BBABA AAAAB AAAAA AAABA ABBBA ABBAB BBBAA ABABB AABAA BAABB BAABB AABAA BAAAB BAABA BBABB",
    description:
      "Bacon disguised his messages using only A and B. Every 5 letters form one character.",
    hint: "Bacon's cipher: 5-bit code where A=0 and B=1 (a=AAAAA ... z=BBAAB).",
    flag: "flag{bacon_letters}",
  },
  {
    id: 15,
    difficulty: "hard",
    title: "RSA One-Bit",
    points: 500,
    ciphertext: "170 80 113 86 30 130 4 113 167 100 121 118 97",
    description:
      "Public key cryptosystem with tiny numbers for offline cracking. n=187, e=3. You can pre-compute d from its factors (11 and 17).",
    hint: "phi(n) = (11-1)*(17-1) = 160. Find d where (e*d) mod 160 = 1, then plaintext = c^d mod 187.",
    flag: "flag{rsa_one}",
  },
  {
    id: 26,
    difficulty: "hard",
    title: "Phillip's Matrix",
    points: 500,
    ciphertext: "tcozesonlp",
    description:
      "A 2x2 matrix scramble called the Hill cipher. Each letter pair was multiplied by the matrix [[3,3],[2,5]] modulo 26. The result spells a single secret word.",
    hint: "Inverse of [[3,3],[2,5]] mod 26 is [[15,17],[20,9]]. Wrap the decoded word in flag{...}.",
    flag: "flag{hillcipher}",
  },
  {
    id: 27,
    difficulty: "hard",
    title: "Playfair Fields",
    points: 500,
    ciphertext: "esremqbrimco",
    description:
      "A digraph cipher (encrypts two letters at a time) using the keyword PLAYFAIR and the alphabet a-z with j merged into i. Decode the word, then wrap it in flag{...}.",
    hint: "Build the 5x5 square from keyword PLAYFAIR. Same-row, same-column, and rectangle rules all apply.",
    flag: "flag{knightriders}",
  },
  {
    id: 28,
    difficulty: "hard",
    title: "Least Significant Ceiling",
    points: 500,
    ciphertext:
      "a2 1d 07 bc 46 3f 39 22 bc 1a ad bd e4 8b 17 96 6d 08 06 16 36 3b 81 9a 07 8f 33 b6 a6 b3 8b 6a 39 73 96 47 cf df 01 c2 ce 28 b3 6d 56 47 27 36 f5 c3 56 1a 17 61 19 5a d8 59 9a 42 ce 0b bb 74 89 1f f9 ed 61 14 8d 4a d5 a1 9e e2 dd 5d 93 30 b4 10 0b a8 3b c5 4b fc 15 da 3b dc 18 61 47 74 a3 d5 5d 28 5e 5b 35 aa 45 b3 ef af a4 13 9b a2 2b 89 bb 3f 29 76 61 44 fc ec a2 b1 8e 39 af 52 d7 c4 c7 0e 3b d3 09 ce 50 67 45 11 36 e9 f1 90 e0 b6 51 36 a7 7f 65 e2 eb a4 75 25 43 23 3f be",
    description:
      "Each two-character byte hides a single bit — its least significant bit. Read those bits out of every byte in order and group them by 8 to reveal the message.",
    hint: "Take the last hex digit's parity of each byte. Every 8 LSBs = one ASCII character (least-significant-bit first).",
    flag: "flag{lsb_stego_hunt}",
  },
  {
    id: 29,
    difficulty: "hard",
    title: "RSA Round Two",
    points: 500,
    ciphertext: "119 4 59 38 7 49 80 59 17 129 37 45 5",
    description:
      "Another breakable RSA: n=143 with factors 11 and 13, exponent e=7. Compute the private key and decrypt to plain ASCII.",
    hint: "phi(143) = 120. Find d where 7*d mod 120 = 1, then plaintext = c^d mod 143 for each number.",
    flag: "flag{rsa_two}",
  },
  {
    id: 30,
    difficulty: "hard",
    title: "Mega Layering",
    points: 500,
    ciphertext: "63336c7564487436636e527558336c7562484a6c5a6e303d",
    description:
      "Three different encodings were stacked on top of each other, in this order from the inside out: ROT13, then base64, then hex.",
    hint: "Unwrap in reverse: hex first, then base64, then ROT13.",
    flag: "flag{mega_layers}",
  },
  {
    id: 34,
    difficulty: "hard",
    title: "HTTP Heist",
    points: 500,
    ciphertext:
      "474554202f66696c65732f646174612e7478743f746f6b656e3d5a6d78685a33746f6448527758334e7561575a6d5a584a3920485454502f312e310d0a486f73743a206374662d696e7465726e616c2e6c6f63616c0d0a0d0a",
    description:
      "An HTTP request was captured on the wire. Nobody encrypts anything on this internal network, so the whole request is readable. The credentials travelled inside the URL.",
    hint: "Decode the hex bytes to read the GET request. The `token` query parameter is base64 — decode it to find the flag.",
    flag: "flag{http_sniffer}",
  },
];

const all = [...easy, ...medium, ...hard];

const CATEGORIES = [
  "General Skills",
  "Forensics",
  "Wireshark Analysis",
  "Other Topics",
  "OSINT",
  "Web Exploitation",
];

const categoryMap = {
  1: "General Skills",
  2: "General Skills",
  3: "General Skills",
  4: "General Skills",
  5: "General Skills",
  6: "General Skills",
  7: "General Skills",
  8: "General Skills",
  9: "General Skills",
  10: "General Skills",
  11: "General Skills",
  12: "General Skills",
  13: "General Skills",
  14: "General Skills",
  15: "General Skills",
  16: "General Skills",
  17: "General Skills",
  18: "General Skills",
  19: "General Skills",
  20: "General Skills",
  21: "General Skills",
  22: "General Skills",
  23: "General Skills",
  24: "General Skills",
  25: "General Skills",
  26: "General Skills",
  27: "General Skills",
  28: "Forensics",
  29: "General Skills",
  30: "General Skills",
  31: "Wireshark Analysis",
  32: "Forensics",
  33: "Forensics",
  34: "Wireshark Analysis",
  35: "Other Topics",
  36: "Other Topics",
  37: "General Skills",
  38: "General Skills",
  39: "General Skills",
  40: "General Skills",
  41: "General Skills",
  42: "General Skills",
  43: "General Skills",
  44: "General Skills",
  45: "OSINT",
  46: "OSINT",
  47: "OSINT",
  48: "Forensics",
  49: "Forensics",
  50: "Forensics",
  51: "Web Exploitation",
  52: "Web Exploitation",
  53: "Web Exploitation",
  54: "Forensics",
  55: "Forensics",
  56: "General Skills",
  57: "Forensics",
  58: "General Skills",
};

all.forEach((c) => {
  c.category = categoryMap[c.id] || "General Skills";
});

module.exports = {
  easy,
  medium,
  hard,
  all,
  categories: CATEGORIES,
  getById(id) {
    return all.find((c) => c.id === Number(id));
  },
  totalPoints() {
    return all.reduce((sum, c) => sum + c.points, 0);
  },
};