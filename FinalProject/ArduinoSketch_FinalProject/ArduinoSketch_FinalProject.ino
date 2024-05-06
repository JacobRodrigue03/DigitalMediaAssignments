#define VRX_PIN A0
#define VRY_PIN A1
#define SW_PIN 2
#define LED1_PIN 5
#define LED2_PIN 6
#define LED3_PIN 7

int joyX = 0, joyY = 0, sw = 0;

const int numReadings = 10;

int xReadings[numReadings];  // the readings from the analog input
int yReadings[numReadings];
int readIndex = 0;          // the index of the current reading
float xTotal = 0, yTotal = 0;              // the running total
float xAverage = 0, yAverage = 0;            // the average
float xStart, yStart;
bool start = false;
unsigned long lastTime = 0;
const int interval = 16;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(SW_PIN, INPUT_PULLUP);
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(LED3_PIN, OUTPUT);

  for(int i = 0; i < numReadings; i++) {
    xReadings[i] = 0;
    yReadings[i] = 0;
  }
}

void loop() {
  // put your main code here, to run repeatedly:
  int x = analogRead(VRX_PIN);
  int y = analogRead(VRY_PIN);
  int sw = digitalRead(SW_PIN);

  xTotal = xTotal - xReadings[readIndex];
  yTotal = yTotal - yReadings[readIndex];
  // read from the sensor:
  xReadings[readIndex] = x;
  yReadings[readIndex] = y;
  // add the reading to the total:
  xTotal = xTotal + x;
  yTotal = yTotal + y;
  // advance to the next position in the array:
  readIndex = readIndex + 1;

  // calculate the average:
  xAverage = xTotal / numReadings;
  yAverage = yTotal / numReadings;

  // if we're at the end of the array...
  if (readIndex >= numReadings) {
    // ...wrap around to the beginning:
    readIndex = 0;
    if (!start) {
      xStart = xAverage;
      yStart = yAverage;
      start = true;
    }
  }

  if (start) {
    unsigned long now = millis();
    if (now - lastTime > interval) {
      //Serial.print("x = ");
      Serial.print((int) (xAverage-xStart));
      Serial.print(",");
      Serial.print((int) (yAverage-yStart));
      Serial.print(",");
      Serial.println(!sw);
    
      lastTime = now;
    }

    if (Serial.available() > 0) {
    int lifeCount = Serial.parseInt();

    if (lifeCount >= 1) {
        digitalWrite(LED1_PIN, HIGH);
    }else {
      digitalWrite(LED1_PIN, LOW);
    }
    if (lifeCount >= 2) {
      digitalWrite(LED2_PIN, HIGH);
    } else {
      digitalWrite(LED2_PIN, LOW);
    }
    if (lifeCount >= 3) {
      digitalWrite(LED3_PIN, HIGH);
    } else {
      digitalWrite(LED3_PIN, LOW);
    }

    delay(20);
  }
}
}