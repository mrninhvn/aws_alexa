#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <BlynkSimpleEsp8266.h>
#include <math.h>

char auth[] = "oCqRN25xq72lfrdpdX4K0CNPchm2kEnP";

void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  Serial.println(myWiFiManager->getConfigPortalSSID());
}

BlynkTimer timer;

WidgetBridge bridgeRGB(V1);
WidgetBridge bridgeDisplay(V2);

BLYNK_CONNECTED() {
  bridgeRGB.setAuthToken("P5WryBvOBL-OHdSgy7W6aoUyqNvi68yj");
  bridgeDisplay.setAuthToken("aipPOted72RwORpKRfuy2GUUjVbCEAe8");
}

void lightUpdate()
{
  float Vout = 3.3*analogRead(A0)/1024;
  float lux = 500000/((10000*Vout)/(3.3 - Vout));
  lux = roundf(lux*10)/10;
  Blynk.virtualWrite(V0, lux);
  bridgeRGB.virtualWrite(V1, lux);
  bridgeDisplay.virtualWrite(V0, lux);
}

void checkConnect()
{
  if (!Blynk.connected()){
    Serial.println("Blynk disconnected");
    if (!WiFi.isConnected()){
      Serial.println("Wifi disconnect -> Try reset");
      ESP.reset();
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  WiFiManager wifiManager;
  wifiManager.setAPCallback(configModeCallback);
  wifiManager.setTimeout(150);
  if(!wifiManager.autoConnect("Light Node")) {
    Serial.println("Failed to connect and hit timeout");
    ESP.reset();
  }
  Serial.println("Wifi connected");

  Blynk.config(auth);
  Blynk.connect(5000);
  if (!Blynk.connected()){
    Serial.println("Warning: Cannot connect to Blynk");
  }
  else{
    Serial.println("All connected.... yeey :))");
  }
  timer.setInterval(3000L, checkConnect);
  timer.setInterval(100L, lightUpdate);
}

void loop(){
  Blynk.run();
  timer.run();
}
