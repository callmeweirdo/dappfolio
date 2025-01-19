import { Link, Tabs } from 'expo-router'
import { Button, useTheme } from 'tamagui'
import { Atom, AudioWaveform, Briefcase, HardHat, Home, NotebookTabs } from '@tamagui/lucide-icons'

export default function TabLayout() {
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.red10.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.color.val,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Button mr="$4" bg="$purple8" color="$purple12">
                Hello!
              </Button>
            </Link>
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: 'About Dev',
          tabBarIcon: ({ color }) => <NotebookTabs color={color} />,
        }}
      />

      <Tabs.Screen
        name="projects"
        options={{
          title: 'Dev Projects',
          tabBarIcon: ({ color }) => <Briefcase color={color} />,
        }}
      />

      <Tabs.Screen
        name="skills"
        options={{
          title: 'Dev Skills',
          tabBarIcon: ({ color }) => <HardHat color={color} />,
        }}
      />

    </Tabs>
  )
}
