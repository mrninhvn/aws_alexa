#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <BlynkSimpleEsp8266.h>
#include <WEMOS_SHT3X.h>
#include <math.h>

SHT3X sht30(0x45);

char auth[] = "OWXj3FR7I0UBgFU_8zbxnDRidZphbwtb";

void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  Serial.println(myWiFiManager->getConfigPortalSSID());
}

BlynkTimer timer;

WidgetBridge bridgeDisplay(V2);
WidgetBridge bridgeMist(V3);
WidgetBridge bridgeFan(V4);

BLYNK_CONNECTED() {
  bridgeDisplay.setAuthToken("aipPOted72RwORpKRfuy2GUUjVbCEAe8");
  bridgeMist.setAuthToken("ivoyEBPsTcNU2NuW6rS-yYaAxu9mVaGG");
  bridgeFan.setAuthToken("TT1J1pUsvIoUKa8rXzGb1pQYlDoRTKdP");
}

void thUpdate()
{
  sht30.get();
  float temp = roundf(sht30.cTemp*10)/10;
  float humi = roundf(sht30.humidity*10)/10;
  Blynk.virtualWrite(V0, temp);
  Blynk.virtualWrite(V1, humi);
  bridgeDisplay.virtualWrite(V1, temp);
  bridgeDisplay.virtualWrite(V2, humi);
  bridgeMist.virtualWrite(V1, humi);
  bridgeFan.virtualWrite(V1, temp);
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
  if(!wifiManager.autoConnect("Temp&Humi Node")) {
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
  timer.setInterval(100L, thUpdate);
}

void loop(){
  Blynk.run();
  timer.run();
}
