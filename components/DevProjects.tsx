import React, { useState, useEffect } from "react";
import { Button, Card, H2, Paragraph, ScrollView, XStack, YStack, Input, Sheet, Label } from "tamagui";
import { Link } from "expo-router";
import { useContracts } from "../hook/ethersSetup";
import { Image, StyleSheet, ActivityIndicator } from "react-native";

// Styles definition
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  addButton: {
    marginBottom: 20,
    marginHorizontal: 16,
  },
  input: {
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    padding: 10,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

// NoProjectsCard Component
const NoProjectsCard = () => (
  <Card padding="$4" marginVertical="$2">
    <Paragraph>No projects available</Paragraph>
  </Card>
);

// DevsCards Component
const DevsCards = ({ name, description, imageUrl, link, onEdit }) => (
  <Card padding="$4" marginVertical="$2">
    <YStack space="$2">
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <H2>{name}</H2>
      <Paragraph>{description}</Paragraph>
      <XStack space="$2">
        <Link href={link} asChild>
          <Button flex={1}>View Details</Button>
        </Link>
        <Button flex={1} onPress={onEdit}>Edit</Button>
      </XStack>
    </YStack>
  </Card>
);

// Main Component
const DevsProjects = () => {
  const { projectContract } = useContracts();
  const [projects, setProjects] = useState([]);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newProject, setNewProject] = useState({
    date: "",
    name: "",
    description: "",
    githubUrl: "",
    image: "",
  });

  // Fetch projects
  const fetchProjects = async () => {
    if (!projectContract) {
      setError("Contract not initialized");
      return;
    }

    try {
      setLoading(true);
      const projectData = await projectContract.getAllProjects();
      const formattedProjects = projectData.map(project => ({
        id: project.id.toString(),
        date: project.date,
        name: project.name,
        description: project.description,
        githubUrl: project.githubUrl,
        image: project.image
      }));
      setProjects(formattedProjects);
      setError(null);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  // Add new project
  const addProject = async () => {
    try {
      setLoading(true);
      const tx = await projectContract.insertProject(
        newProject.date,
        newProject.name,
        newProject.description,
        newProject.githubUrl,
        newProject.image
      );
      await tx.wait();
      await fetchProjects();
      setError(null);
      return true;
    } catch (err) {
      console.error("Error adding project:", err);
      setError("Failed to add project");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update existing project
  const updateProject = async () => {
    try {
      setLoading(true);
      const tx = await projectContract.updateProject(
        editProject.id,
        newProject.date,
        newProject.name,
        newProject.description,
        newProject.githubUrl,
        newProject.image
      );
      await tx.wait();
      await fetchProjects();
      setError(null);
      return true;
    } catch (err) {
      console.error("Error updating project:", err);
      setError("Failed to update project");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!newProject.name || !newProject.description) {
      setError("Name and description are required");
      return;
    }

    const success = editProject ? await updateProject() : await addProject();
    
    if (success) {
      setSheetVisible(false);
      setNewProject({
        date: "",
        name: "",
        description: "",
        githubUrl: "",
        image: "",
      });
    }
  };

  // Open sheet for editing or adding
  const openSheet = (project = null) => {
    setError(null);
    setEditProject(project);
    if (project) {
      setNewProject({
        date: project.date,
        name: project.name,
        description: project.description,
        githubUrl: project.githubUrl,
        image: project.image,
      });
    } else {
      setNewProject({
        date: "",
        name: "",
        description: "",
        githubUrl: "",
        image: "",
      });
    }
    setSheetVisible(true);
  };

  useEffect(() => {
    if (projectContract) {
      fetchProjects();
    }
  }, [projectContract]);

  if (loading && !sheetVisible) {
    return (
      <YStack style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </YStack>
    );
  }

  return (
    <YStack flex={1}>
      {error && <Paragraph style={styles.errorText}>{error}</Paragraph>}
      
      <ScrollView style={styles.scrollView}>
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <DevsCards
              key={index}
              name={project.name}
              description={project.description}
              imageUrl={project.image}
              link="/project"
              onEdit={() => openSheet(project)}
            />
          ))
        ) : (
          <NoProjectsCard />
        )}
      </ScrollView>

      <Button 
        onPress={() => openSheet()}
        style={styles.addButton}
        disabled={loading}
      >
        Add New Project
      </Button>

      <Sheet
        modal
        open={sheetVisible}
        onOpenChange={setSheetVisible}
        snapPoints={[80, 40, 0]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame padding="$4" backgroundColor="$background">
          <Sheet.Handle />
          <ScrollView>
            <YStack space="$4">
              <H2>{editProject ? "Edit Project" : "Add New Project"}</H2>
              
              <YStack space="$2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  value={newProject.date}
                  onChangeText={(text) => setNewProject(prev => ({...prev, date: text}))}
                  style={styles.input}
                  disabled={loading}
                />

                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChangeText={(text) => setNewProject(prev => ({...prev, name: text}))}
                  style={styles.input}
                  disabled={loading}
                />

                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newProject.description}
                  onChangeText={(text) => setNewProject(prev => ({...prev, description: text}))}
                  style={styles.input}
                  disabled={loading}
                />

                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  value={newProject.githubUrl}
                  onChangeText={(text) => setNewProject(prev => ({...prev, githubUrl: text}))}
                  style={styles.input}
                  disabled={loading}
                />

                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={newProject.image}
                  onChangeText={(text) => setNewProject(prev => ({...prev, image: text}))}
                  style={styles.input}
                  disabled={loading}
                />

                <Button 
                  onPress={handleSubmit}
                  disabled={loading}
                  opacity={loading ? 0.5 : 1}
                >
                  {loading ? "Processing..." : (editProject ? "Update Project" : "Add Project")}
                </Button>
              </YStack>
            </YStack>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
};

export default DevsProjects;