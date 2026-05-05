import React, { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";

export default function Dashboard() {
  const [followersFile, setFollowersFile] = useState("");
  const [followingFile, setFollowingFile] = useState("");

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [notBack, setNotBack] = useState([]);
  const [search, setSearch] = useState("");

  // CLEAN USERNAME
  const clean = (name) =>
    String(name || "")
      .toLowerCase()
      .trim()
      .replace(/^@/, "");

  // UNIVERSAL INSTAGRAM JSON PARSER
  const extractUsers = (json) => {
    const found = new Set();

    const visit = (node) => {
      if (!node) return;

      if (Array.isArray(node)) {
        node.forEach(visit);
        return;
      }

      if (typeof node === "object") {
        // Instagram common format
        if (Array.isArray(node.string_list_data)) {
          node.string_list_data.forEach((item) => {
            if (item?.value) found.add(clean(item.value));
          });
        }

        // Sometimes username stored here
        if (typeof node.title === "string") {
          found.add(clean(node.title));
        }

        if (typeof node.username === "string") {
          found.add(clean(node.username));
        }

        Object.values(node).forEach(visit);
      }
    };

    visit(json);

    return [...found].filter(Boolean);
  };

  // PICK FOLLOWERS FILE
  const pickFollowers = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
    });

    if (!result.canceled) {
      const file = result.assets[0];
      setFollowersFile(file.name);

      const res = await fetch(file.uri);
      const json = await res.json();

      const users = extractUsers(json);
      setFollowers(users);
    }
  };

  // PICK FOLLOWING FILE
  const pickFollowing = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
    });

    if (!result.canceled) {
      const file = result.assets[0];
      setFollowingFile(file.name);

      const res = await fetch(file.uri);
      const json = await res.json();

      const users = extractUsers(json);
      setFollowing(users);
    }
  };

  // ANALYZE
  const analyze = () => {
    const result = following.filter((user) => !followers.includes(user));
    setNotBack(result);
  };

  const filtered = notBack.filter((user) =>
    user.includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.count}>Followers: {followers.length}</Text>
      <Text style={styles.count}>Following: {following.length}</Text>
      <Text style={styles.count}>Not Following Back: {notBack.length}</Text>

      {/* Followers */}
      <TouchableOpacity style={styles.btn} onPress={pickFollowers}>
        <Text style={styles.btnText}>Upload Followers File</Text>
      </TouchableOpacity>

      {followersFile ? (
        <Text style={styles.success}>✅ {followersFile}</Text>
      ) : null}

      {/* Following */}
      <TouchableOpacity style={styles.btn} onPress={pickFollowing}>
        <Text style={styles.btnText}>Upload Following File</Text>
      </TouchableOpacity>

      {followingFile ? (
        <Text style={styles.success}>✅ {followingFile}</Text>
      ) : null}

      {/* Analyze */}
      <TouchableOpacity style={styles.btn} onPress={analyze}>
        <Text style={styles.btnText}>Analyze</Text>
      </TouchableOpacity>

      {/* Search */}
      <TextInput
        style={styles.search}
        placeholder="Search Username"
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
      />

      {/* Result */}
      <Text style={styles.heading}>Not Following Back</Text>

      {filtered.map((user, index) => (
        <Text key={index} style={styles.user}>
          {user}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
  },

  btn: {
    backgroundColor: "#ff4f7d",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  success: {
    color: "#00ff88",
    marginBottom: 10,
  },

  heading: {
    color: "#fff",
    fontSize: 24,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },

  user: {
    color: "#fff",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  count: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 8,
    fontWeight: "bold",
  },

  search: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
});