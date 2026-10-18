MULTANI KART — Nandasan
========================

આ અપડેટમાં:
- ગ્રાહક માટે પ્રોડક્ટ લિસ્ટ, શોધ, કાર્ટ અને ઓર્ડર
- ઓર્ડર/ડિલિવરી સ્ટેટસ: New, Accepted, Packed, Out for Delivery, Delivered, Cancelled
- Admin Dashboardમાં ઓર્ડર, ગ્રાહક, વસ્તુઓ, કુલ અને પેમેન્ટ સ્થિતિ
- પ્રોડક્ટ ઉમેરવી અને નામ, કેટેગરી, દુકાન, ભાવ, સ્ટોક તથા ઉપલબ્ધતા બદલવી
- Admin Login વિના Shopkeeper, Delivery અને Admin પેનલ/API ઍક્સેસ નહીં
- UPI QR checkout (માત્ર UPI_ID સેટ હોય ત્યારે) અને manual payment confirmation
- મોબાઇલ માટે responsive layout

LOCAL RUN
1. ZIP extract કરો.
2. આ folderમાં terminal ખોલો.
3. `npm install`
4. નીચેના environment variables સેટ કરો અને `npm start` ચલાવો.
5. http://localhost:3000 ખોલો.

RENDER ENVIRONMENT VARIABLES
પહેલેથી જરૂરી:
- ADMIN_USERNAME = Admin login username
- ADMIN_PASSWORD = લાંબો અને unique password
- SESSION_SECRET = ઓછામાં ઓછા 32 random charactersની ગુપ્ત string

પેમેન્ટ અને ઓર્ડર WhatsApp માટે:
- UPI_ID = તમારું સાચું UPI ID (ઉદાહરણ માત્ર: name@bank; આ નમૂનો વાપરશો નહીં)
- PAYMENT_NAME = UPI પર દેખાડવાનું payee name, જેમ કે MULTANI KART
- ORDER_WHATSAPP_NUMBER = દેશના કોડ સાથે digits only, ઉદાહરણ: 91XXXXXXXXXX. તમારો સાચો business WhatsApp નંબર નાખો.
- DB_PATH = જો Render Persistent Disk `/var/data` પર mount કર્યો હોય તો `/var/data/multani-kart.db` સેટ કરો.

UPI PAYMENT SAFETY
- UPI QR ચુકવણી શરૂ કરવામાં મદદ કરે છે, પણ આ પ્રોજેક્ટ payment gateway નથી અને ચુકવણી આપમેળે verify કરતું નથી.
- Adminએ પોતાની UPI/bank appમાં રકમ વાસ્તવમાં જમા થયેલી ચકાસ્યા પછી જ Payment Statusને `Paid` કરવું.
- UPI_ID સેટ ન હોય તો Online Payment બંધ રહેશે અને ગ્રાહક Cash on Delivery પસંદ કરી શકે છે.
- WhatsApp બટન ગ્રાહકના ક્લિક પછી WhatsApp ખોલે છે; ગ્રાહકે Send દબાવવું પડે છે. આપમેળે સંદેશ મોકલાતો નથી.

IMPORTANT PRODUCTION NOTES
- SQLite database (`multani-kart.db`) local file છે. Render પર Persistent Disk `/var/data` mount કરીને `DB_PATH=/var/data/multani-kart.db` સેટ કરો, અથવા persistent PostgreSQL વાપરો. Durable storage અને backups વગર વાસ્તવિક orders ન લો.
- express-sessionનો default MemoryStore production માટે યોગ્ય નથી. લાંબા ગાળાના live ઉપયોગ પહેલાં persistent session store configure કરો.
- Shopkeeper/Delivery હાલમાં Admin session વડે જ સુરક્ષિત છે; અલગ staff accounts/permissions નથી.
- પ્રોડક્ટના હાલના ભાવ/સ્ટોક sample data છે. વાસ્તવિક ઉપયોગ પહેલાં સ્થાનિક દુકાનો પાસેથી ભાવ અને availability ચકાસો.
- આ પેકેજમાં કોઈ secret/password/UPI ID/WhatsApp નંબર hard-code કરેલો નથી.
