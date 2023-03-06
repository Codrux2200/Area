FROM reactnativecommunity/react-native-android:2.1

# set locale to utf8 for fastlane
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

# WORKDIR /usr/src/app

# install bundler
RUN gem install bundler

COPY . .

RUN npm install -g react-native-cli

RUN npm install

RUN react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

RUN cd android/app/src/main/res && rm -rf drawable-hdpi drawable-mdpi drawable-xhdpi drawable-xxhdpi drawable-xxxhdpi

RUN cd - && cd android && ./gradlew assembleRelease