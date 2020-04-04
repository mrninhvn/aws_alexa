#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <BlynkSimpleEsp8266.h>

char auth[] = "oCqRN25xq72lfrdpdX4K0CNPchm2kEnP";

void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  Serial.println(myWiFiManager->getConfigPortalSSID());
}

BlynkTimer timer;

WidgetBridge bridgeLight(V1);

BLYNK_CONNECTED() {
  bridgeLight.setAuthToken("P5WryBvOBL-OHdSgy7W6aoUyqNvi68yj");
}

void lightUpdate()
{
  float Vout = 3.3*analogRead(A0)/1024;
  float lux = 500000/((10000*Vout)/(3.3 - Vout));
  Blynk.virtualWrite(V0, lux);
  bridgeLight.virtualWrite(V1, lux);
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
