import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { XStack, YStack, Button, Anchor } from 'tamagui';
import Icon from 'react-native-vector-icons/FontAwesome';

const DevHome = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <XStack
          flex={1}
          gap="$4"
          justifyContent="center"
          alignItems="center"
          $gtSm={{ flexDirection: 'row' }}
          $sm={{ flexDirection: 'column' }}
        >
          {/* Right Column (Profile Image and Social Links) */}
          <YStack
            flex={0.4}
            style={styles.rightColumn}
            bg="rgba(255, 255, 255, 0.8)"
            padding="$4"
            alignItems="center"
            justifyContent="center"
            $sm={{ flex: 1 }}
          >
            {/* Profile Image */}
            <Image
              source={{
                uri: 'https://cdn.dribbble.com/userupload/5859589/file/original-55534b3895c5e6fee63696b7418eade7.png?resize=752x',
              }}
              style={styles.profileImage}
            />

            {/* Full Name */}
            <Text style={styles.fullName}>Developer Name</Text>

            {/* Social Media Links */}
            <Text style={styles.subheading}>Find me on</Text>
            <XStack space="$3" marginTop="$2">
              <Anchor href="https://github.com" target="_blank">
                <Image
                  source={{ uri: 'https://image.flaticon.com/icons/png/512/25/25231.png' }}
                  style={styles.icon}
                />
              </Anchor>
              <Anchor href="https://linkedin.com" target="_blank">
                <Image
                  source={{ uri: 'https://image.flaticon.com/icons/png/512/61/61109.png' }}
                  style={styles.icon}
                />
              </Anchor>
              <Anchor href="https://twitter.com" target="_blank">
                <Image
                  source={{ uri: 'https://image.flaticon.com/icons/png/512/733/733579.png' }}
                  style={styles.icon}
                />
              </Anchor>
            </XStack>
          </YStack>

          {/* Left Column (Description and Contact Info) */}
          <YStack
            flex={0.6}
            style={styles.leftColumn}
            bg="rgba(255, 255, 255, 0.8)"
            padding="$4"
            justifyContent="center"
            $sm={{ flex: 1 }}
          >
            <Text style={styles.title}>Hi, I'm {"David Joseph"}</Text>
            <Text style={styles.description}>
              I'm a passionate developer specializing in web3 and mobile app development. I love
              building seamless, high-performance applications with cutting-edge technologies.
            </Text>

            <Text style={styles.subheading}>Contact Me</Text>
            <Text>Email: {'developer@example.com'}</Text>
            <Text>Location: {'Unknown Location'}</Text>

            {/* Action Buttons */}
            <XStack space="$3" marginTop="$4" alignItems="center">
              <Button
                onPress={() => alert('Liked!')}
                theme="red"
                size="$4"
                icon={<Icon name="heart" size={20} color="#fff" />}
              >
                Like
              </Button>
              <Button
                onPress={() => alert('Followed!')}
                theme="green"
                size="$4"
                icon={<Icon name="user-plus" size={20} color="#fff" />}
              >
                Follow
              </Button>
              <Anchor href="https://yourportfolio.com" target="_blank">
                <Button theme="blue" size="$4" icon={<Icon name="link" size={20} color="#fff" />}>
                  Portfolio
                </Button>
              </Anchor>
              <Anchor href="https://github.com/yourusername" target="_blank">
                <Button
                  theme="purple"
                  size="$4"
                  icon={<Icon name="github" size={20} color="#fff" />}
                >
                  GitHub
                </Button>
              </Anchor>
              <Button
                theme="yellow"
                size="$4"
                onPress={() => alert('Tipped!')}
                icon={<Icon name="money" size={20} color="#fff" />}
              >
                Tip
              </Button>
            </XStack>
          </YStack>
        </XStack>
      </View>
    </ScrollView>
  );
};

export default DevHome;

// Custom Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 1200,
    paddingHorizontal: 16,
  },
  leftColumn: {
    borderRadius: 10,
    padding: 16,
    justifyContent: 'center',
  },
  rightColumn: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  fullName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 16,
  },
  icon: {
    width: 32,
    height: 32,
  },
});
