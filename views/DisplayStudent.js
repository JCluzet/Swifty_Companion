import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { ScrollView } from 'react-native';

const getStatusColor = (project) => {
  if (project["validated?"] === true) {
    return "green";
  }
  if (project["validated?"] === false) {
    return "red";

  }
  switch (project.status) {
    case "in_progress":
      return "yellow";
    case "finished":
      return "green";
    case "parent":
      return "red";
    default:
      return "gray";
  }
};

const DisplayStudent = ({ route }) => {
  const rm_stud = () => {
    AsyncStorage.removeItem('student');
  };

  const { student } = route.params;
  // console.log(JSON.stringify(student, null, 2));



  const displaySkills = (skills) => {
    return skills.map((skill) => (
      <View key={skill.id}>
        <View>
          <Text style={styles.text}>{skill.name}</Text>
        </View>
        <View key={skill.id}>
          <Text style={styles.text}>Niveau: {skill.level}</Text>
        </View>
      </View>
    ));
  };

  const everUseGrademe = (login) => {
    const [hasUsedGradeMe, setHasUsedGradeMe] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('https://user.grademe.fr/exam.txt');
          const textData = response.data;

          if (textData.includes(login)) {
            setHasUsedGradeMe(true);
          } else {
            setHasUsedGradeMe(false);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du fichier exam.txt:', error);
        }
      };

      fetchData();
    }, [login]);

    if (hasUsedGradeMe === null) {
      return null; // Vous pouvez afficher un indicateur de chargement ici si vous le souhaitez
    }

    return (
      <View style={styles.row}>

        <Text style={styles.text}>GradeMe User: </Text>
        <Text style={{ color: hasUsedGradeMe ? 'green' : 'red' }}>
          {hasUsedGradeMe ? 'YES' : 'NO'}
        </Text>
      </View>
    );
  };


  const displayProjects = (projects_users) => {
    return projects_users
      .sort((a, b) => {
        if (a.status === "in_progress" && b.status !== "in_progress") {
          return -1;
        }
        if (a.status !== "in_progress" && b.status === "in_progress") {
          return 1;
        }
        return new Date(b.marked_at) - new Date(a.marked_at);
      })
      .filter((project_user) => {
        return (
          project_user.status === "in_progress" ||
          project_user.status === "finished" ||
          project_user.validated === false
        );
      })
      .map((project_user) => (
        <View key={project_user.id} style={styles.projectContainer}>
          <Text
            style={[
              styles.projectName,
              {
                fontSize:
                  project_user.project.name.length > 30 ? 12 : 14, // Ajustez ces valeurs en fonction de vos préférences
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {project_user.project.name}
          </Text>

          <View style={styles.project_mark}>
            <View>
              {project_user.final_mark !== null ? (
                <Text style={styles.projectName_mark}>
                  {project_user.final_mark}%
                </Text>
              ) : (
                <Text style={styles.projectName_mark}>In Progress</Text>
              )}
            </View>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor(project_user) },
              ]}
            />
          </View>
        </View>
      ));
  };



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image style={styles.studentImage} source={{ uri: student.image.link }} resizeMode="cover" />
      <Text style={styles.login}>{student.login}</Text>
      <Text style={styles.text}>{student.first_name} {student.last_name}</Text>
      <Text style={styles.text}>Email: {student.email}</Text>
      <Text style={styles.text}>Phone number: {student.phone}</Text>
      <Text style={styles.text}>City: {student.campus[0].city}</Text>
      <Text style={styles.text}>Wallet: {student.wallet}</Text>
      <Text style={styles.text}>Correction points: {student.correction_point}</Text>
      <Text style={styles.text}>Level: {student.cursus_users[1].level}</Text>
      <View style={styles.separator} />
      <View style={styles.separator} />
      <Text style={styles.text_project}>Projects:</Text>
      {displayProjects(student.projects_users)}
      <View style={styles.separator} />
      <View style={styles.separator} />
      <Text style={styles.text}>Skills:</Text>
      {/* {displaySkills(student.cursus_users[1].skills)} */}
      {everUseGrademe(student.login)}
      {/* <Text style={styles.text}>Skills: {student.cursus_users[0].skills.length}</Text> */}
      {/* </View> */}
      {/* {displaySkills(student.cursus_users[1].skills)} */}
      {/* {displayCampus(student.campus[0].city)} */}
      {/* <Text style={styles.text}>Cursus:</Text> */}
      {/* {displayCursus(student.cursus_users)} */}
      {/* <Text style={styles.text}>Réalisations:</Text> */}
      {/* {displayAchievements(student.achievements)} */}
      {/* <Button title="BACK" onPress={rm_stud} buttonStyle={styles.buttonlogout} /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
  },
  text: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    fontFamily: 'Courier New',
    fontSize: 17,
  },
  text_project: {
    flex: 1,
    alignItems: "flex-start",
    paddingRight: 16,
    padding: 16,
    fontWeight: 'bold',
    fontFamily: 'Courier New',
    fontSize: 18,
  },
  login: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    fontWeight: 'bold',
    fontFamily: 'Courier New',
    fontSize: 15,
  },
  searchContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginBottom: 16,
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
  },
  project_mark: {
    // flex: 1,
    flexDirection: "row",
  },
  studentImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  containersearch: {
    flex: 1,
    marginTop: 1,
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  projectName: {
    flex: 1,
    marginRight: 8, // Ajoutez une marge à droite pour éviter que le texte ne chevauche l'indicateur de statut
  },
  projectName_mark: {
    flex: 1,
    marginRight: 8, // Ajoutez une marge à droite pour éviter que le texte ne chevauche l'indicateur de statut
    fontWeight: 'bold',
    fontFamily: 'Courier New',
    fontSize: 16,
    color: 'gray',
  },
  input: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  projectContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  separator: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  image: {
    width: 400,
    height: 100,
    marginTop: 10,
  },
});

export default DisplayStudent;
