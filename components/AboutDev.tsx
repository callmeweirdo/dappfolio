import { H2, Paragraph, XStack, YStack, Card, Separator } from 'tamagui';
import React from 'react';
import { ScrollView } from 'react-native';

export function AboutDev() {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      <YStack
        space="$6"
        paddingHorizontal="$6"
        paddingVertical="$8"
        maxWidth={1200}
        marginHorizontal="auto"
      >
        <Section title="Education">
          <ResponsiveGrid>
            <EducationCard
              institution="XYZ University"
              degree="Bachelor of Science in Computer Science"
            />
            <EducationCard
              institution="ABC University"
              degree="Master of Science in Software Engineering"
            />
          </ResponsiveGrid>
        </Section>

        <Section title="Experience">
          <ResponsiveGrid>
            <ExperienceCard role="Software Engineer" company="DEF Company" years="3 years" />
            <ExperienceCard role="Front-End Developer" company="GHI Startup" years="2 years" />
            <ExperienceCard role="Full-Stack Developer" company="JKL Inc." years="4 years" />
          </ResponsiveGrid>
        </Section>

        <Section title="Skills">
          <ResponsiveGrid>
            <SkillCard name="JavaScript" description="Expert in modern JavaScript frameworks like React and Next.js." />
            <SkillCard name="Web3 Development" description="Experience building decentralized apps using Solidity and Hardhat." />
            <SkillCard name="Mobile App Development" description="Proficient in building cross-platform apps with React Native." />
            <SkillCard name="Backend Development" description="Experienced in building robust APIs with Node.js and Laravel." />
          </ResponsiveGrid>
        </Section>

        <Section title="Motivations">
          <Paragraph theme="alt2" textAlign="center">
            I’m inspired by creating impactful solutions that bridge technology and real-world
            needs. Collaboration, innovation, and the ever-evolving tech landscape drive me to
            continuously improve and deliver my best.
          </Paragraph>
          <Paragraph theme="alt2" textAlign="center">
            I believe in making technology accessible to everyone and thrive on solving complex
            challenges with creativity and teamwork.
          </Paragraph>
        </Section>
      </YStack>
    </ScrollView>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <>
    <H2 textAlign="center" color="$color">
      {title}
    </H2>
    <Separator borderColor="$borderColor" width="90%" marginVertical="$4" />
    {children}
  </>
);

const ResponsiveGrid = ({ children }: { children: React.ReactNode }) => (
  <XStack
    flexWrap="wrap"
    justifyContent="center"
    gap="$4"
    $sm={{ flexDirection: 'column', alignItems: 'center' }}
    $md={{ flexDirection: 'row', alignItems: 'flex-start' }}
  >
    {children}
  </XStack>
);

const EducationCard = ({ institution, degree }: { institution: string; degree: string }) => (
  <Card bordered borderWidth={1} padding="$4" backgroundColor="$background" width="100%" maxWidth={300}>
    <Paragraph textAlign="center" fontWeight="bold">
      {degree}
    </Paragraph>
    <Paragraph textAlign="center" theme="alt2">
      {institution}
    </Paragraph>
  </Card>
);

const ExperienceCard = ({
  role,
  company,
  years,
}: {
  role: string;
  company: string;
  years: string;
}) => (
  <Card bordered borderWidth={1} padding="$4" backgroundColor="$background" width="100%" maxWidth={300}>
    <Paragraph textAlign="center" fontWeight="bold">
      {role}
    </Paragraph>
    <Paragraph textAlign="center" theme="alt2">
      {company} ({years})
    </Paragraph>
  </Card>
);

const SkillCard = ({ name, description }: { name: string; description: string }) => (
  <Card bordered borderWidth={1} padding="$4" backgroundColor="$background" width="100%" maxWidth={300}>
    <Paragraph textAlign="center" fontWeight="bold">
      {name}
    </Paragraph>
    <Paragraph textAlign="center" theme="alt2">
      {description}
    </Paragraph>
  </Card>
);

export default AboutDev;