#define BLYNK_TEMPLATE_ID "TMPL3NlMh2YHz"
#define BLYNK_TEMPLATE_NAME "relay"
#define BLYNK_AUTH_TOKEN "3If1Vj9MCP7jNdZaSxVMRW5ntbe23wB0"

#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>

// Your WiFi credentials
char ssid[] = "void";
char pass[] = "11223344";

// Relay pins
#define RELAY1 25
#define RELAY2 26
#define RELAY3 27
#define RELAY4 14

void setup()
{
  Serial.begin(115200);

  pinMode(RELAY1, OUTPUT);
  pinMode(RELAY2, OUTPUT);
  pinMode(RELAY3, OUTPUT);
  pinMode(RELAY4, OUTPUT);

  // Turn all relays OFF at start
  digitalWrite(RELAY1, HIGH);
  digitalWrite(RELAY2, HIGH);
  digitalWrite(RELAY3, HIGH);
  digitalWrite(RELAY4, HIGH);

  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);
}

// Relay 1 control
BLYNK_WRITE(V1)
{
  int state = param.asInt();
  digitalWrite(RELAY1, state);
  Serial.print("Relay1: ");
  Serial.println(state ? "ON" : "OFF");
}

// Relay 2 control
BLYNK_WRITE(V2)
{
  int state = param.asInt();
  digitalWrite(RELAY2, state);
  Serial.print("Relay2: ");
  Serial.println(state ? "ON" : "OFF");
}

// Relay 3 control
BLYNK_WRITE(V3)
{
  int state = param.asInt();
  digitalWrite(RELAY3, state);
  Serial.print("Relay3: ");
  Serial.println(state ? "ON" : "OFF");
}

// Relay 4 control
BLYNK_WRITE(V4)
{
  int state = param.asInt();
  digitalWrite(RELAY4, state);
  Serial.print("Relay4: ");
  Serial.println(state ? "ON" : "OFF");
}

void loop()
{
  Blynk.run();
}

