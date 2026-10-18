MULTANI KART — Nandasan
========================

આ પ્રોજેક્ટમાં:
- Customer storefront, product search, cart અને order checkout
- Cash on Delivery અને Online Payment પસંદગી (વાસ્તવિક payment gateway હજી જોડાયેલું નથી)
- Shopkeeper panel: product add, price અને stock edit
- Delivery panel: order status update
- Admin dashboard: orders, pending orders, product count અને estimated sales
- SQLite database: server પર બધા ગ્રાહકો/પેનલ માટે એક જ database

જરૂરી:
- Node.js 20 અથવા compatible LTS
- npm

કમ્પ્યુટર પર ચલાવવાની રીત:
1. ZIP extract કરો.
2. આ folderમાં terminal / Command Prompt ખોલો.
3. ચલાવો: npm install
4. પછી: npm start
5. બ્રાઉઝરમાં ખોલો: http://localhost:3000

મહત્વની મર્યાદાઓ:
- આ starter / prototype છે, production-ready service નથી.
- હાલમાં login/role permissions નથી. Internet પર public hosting કરતાં પહેલાં સુરક્ષિત authentication અને authorization ઉમેરો.
- Online Payment હજી માત્ર પસંદગી અને status placeholder છે. વાસ્તવિક પેમેન્ટ માટે Razorpay/અન્ય gatewayનું server-side integration, webhook verification અને business KYC જરૂરી છે.
- ડિલિવરી 20–30 મિનિટનું target છે, ખાતરી નહીં.
- SQLite database એ જ server પર shared છે. અલગ-અલગ મોબાઇલમાંથી વાપરવા માટે serverને online host કરવો પડશે.
- ગ્રાહકોના સાચા વ્યક્તિગત ડેટા સાથે live ઉપયોગ કરતાં પહેલાં privacy, backups, access control અને security review જરૂરી છે.
- શરૂઆતમાં sample products ઉમેરેલા છે; ભાવ/સ્ટોક સ્થાનિક દુકાનો મુજબ સુધારો.
- દુકાનદારોને અલગ-અલગ પોતાના products દેખાય અને માત્ર પોતાના orders manage કરે તે માટે production permissions હજી બનાવવાના છે.

આ ડેમો payment collect કરતું નથી અને કોઈ વાસ્તવિક order dispatch કરતું નથી.

ઓર્ડર ફોન / WhatsApp:
- UIમાં +91 84888 07767 માટે WhatsApp order message button ઉમેર્યું છે.
- ઓર્ડર server databaseમાં save થયા પછી ગ્રાહક "WhatsApp પર ઓર્ડર મોકલો" દબાવે.
- WhatsApp ખુલશે અને order message prefilled હશે; ગ્રાહકે Send દબાવવું પડશે.
- WhatsApp Business API/provider જોડ્યા વગર મેસેજ સંપૂર્ણ આપમેળે મોકલી શકાતો નથી.
- જો તમે આ નંબર પર SMS/WhatsApp automatic notifications ઇચ્છો તો WhatsApp Business Platform/Twilio/અન્ય provider account, verification અને credentials સાથે server integration જરૂરી છે.

કેટલોગ:
- કરિયાણું, ડેરી, શાકભાજી, ફળો, ઘરવપરાશની વસ્તુઓ, snacks અને sample hotel/restaurant menu ઉમેર્યું છે.
- પ્રોડક્ટના ભાવ અને સ્ટોક માત્ર demo માટે છે. સ્થાનિક દુકાનદાર પાસેથી સાચા ભાવ, stock અને availability confirm કરીને અપડેટ કરો.
- Hotel Food વસ્તુઓ demo menu છે; Nandasanમાં સંબંધિત દુકાનો/હોટેલ સાથે મંજૂરી અને actual menu confirm કરો.
