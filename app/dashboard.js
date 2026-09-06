import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function Dashboard() {
  const { width } = useWindowDimensions();

  const [followersFile, setFollowersFile] = useState("");
  const [followingFile, setFollowingFile] = useState("");

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  // People you follow but who don't follow you back
  const [notBack, setNotBack] = useState([]);

  const [search, setSearch] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const isDesktop = width > 700;

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

      // If array, check every item
      if (Array.isArray(node)) {
        node.forEach(visit);
        return;
      }

      // If object
      if (typeof node === "object") {
        // Common Instagram JSON format
        if (Array.isArray(node.string_list_data)) {
          node.string_list_data.forEach((item) => {
            if (item?.value) {
              found.add(clean(item.value));
            }
          });
        }

        // Other possible username formats
        if (typeof node.title === "string") {
          found.add(clean(node.title));
        }

        if (typeof node.username === "string") {
          found.add(clean(node.username));
        }

        // Recursively check nested data
        Object.values(node).forEach(visit);
      }
    };

    visit(json);

    return [...found].filter(Boolean);
  };

  // PICK FOLLOWERS FILE
  const pickFollowers = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const file = result.assets[0];

        setFollowersFile(file.name);

        const response = await fetch(file.uri);
        const json = await response.json();

        const users = extractUsers(json);

        console.log("Followers:", users.length);

        setFollowers(users);
        setNotBack([]);
        setAnalyzed(false);
      }
    } catch (error) {
      console.log("Followers upload error:", error);

      Alert.alert(
        "Upload Failed",
        "Please select a valid followers JSON file.",
      );
    }
  };

  // PICK FOLLOWING FILE
  const pickFollowing = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const file = result.assets[0];

        setFollowingFile(file.name);

        const response = await fetch(file.uri);
        const json = await response.json();

        const users = extractUsers(json);

        console.log("Following:", users.length);

        setFollowing(users);
        setNotBack([]);
        setAnalyzed(false);
      }
    } catch (error) {
      console.log("Following upload error:", error);

      Alert.alert(
        "Upload Failed",
        "Please select a valid following JSON file.",
      );
    }
  };

  // ANALYZE
  const analyze = () => {
    if (!followersFile || !followingFile) {
      Alert.alert(
        "Files Required",
        "Please upload both Followers and Following files first.",
      );
      return;
    }

    // Convert followers array into a Set
    const followersSet = new Set(followers);

    // Find people YOU follow who are NOT in your followers list
    const result = following.filter((user) => !followersSet.has(user));

    setNotBack(result);
    setAnalyzed(true);
  };

  // RESET EVERYTHING
  const reset = () => {
    setFollowersFile("");
    setFollowingFile("");
    setFollowers([]);
    setFollowing([]);
    setNotBack([]);
    setSearch("");
    setAnalyzed(false);
  };

  // SEARCH FILTER
  const filtered = notBack.filter((user) =>
    user.includes(search.toLowerCase().trim()),
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>InstaTrack</Text>

        <Text style={styles.title}>Instagram Follower Analyzer</Text>

        <Text style={styles.subtitle}>
          Upload your Instagram followers and following data to discover who
          isn't following you back.
        </Text>
      </View>

      {/* STATISTICS */}
      <View style={[styles.statsContainer, isDesktop && styles.statsDesktop]}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{followers.length}</Text>

          <Text style={styles.statLabel}>Followers</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{following.length}</Text>

          <Text style={styles.statLabel}>Following</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{notBack.length}</Text>

          <Text style={styles.statLabel}>Not Following Back</Text>
        </View>
      </View>

      {/* UPLOAD SECTION */}
      <View style={[styles.uploadSection, isDesktop && styles.uploadDesktop]}>
        {/* FOLLOWERS */}
        <View style={styles.uploadCard}>
          <Text style={styles.uploadIcon}>👥</Text>

          <Text style={styles.uploadTitle}>Followers</Text>

          <Text style={styles.uploadDescription}>
            Upload your followers JSON file
          </Text>

          <TouchableOpacity style={styles.uploadButton} onPress={pickFollowers}>
            <Text style={styles.uploadButtonText}>Upload Followers</Text>
          </TouchableOpacity>

          {followersFile ? (
            <Text style={styles.success}>✓ {followersFile}</Text>
          ) : (
            <Text style={styles.pending}>No file selected</Text>
          )}
        </View>

        {/* FOLLOWING */}
        <View style={styles.uploadCard}>
          <Text style={styles.uploadIcon}>👤</Text>

          <Text style={styles.uploadTitle}>Following</Text>

          <Text style={styles.uploadDescription}>
            Upload your following JSON file
          </Text>

          <TouchableOpacity style={styles.uploadButton} onPress={pickFollowing}>
            <Text style={styles.uploadButtonText}>Upload Following</Text>
          </TouchableOpacity>

          {followingFile ? (
            <Text style={styles.success}>✓ {followingFile}</Text>
          ) : (
            <Text style={styles.pending}>No file selected</Text>
          )}
        </View>
      </View>

      {/* ANALYZE BUTTON */}
      <TouchableOpacity
        style={styles.analyzeButton}
        onPress={analyze}
        activeOpacity={0.8}
      >
        <Text style={styles.analyzeButtonText}>Analyze My Instagram</Text>
      </TouchableOpacity>

      {/* RESET BUTTON */}
      {(followers.length > 0 || following.length > 0) && (
        <TouchableOpacity style={styles.resetButton} onPress={reset}>
          <Text style={styles.resetText}>Clear All Data</Text>
        </TouchableOpacity>
      )}

      {/* BEFORE ANALYSIS */}
      {!analyzed && followers.length > 0 && following.length > 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>

          <Text style={styles.emptyTitle}>Ready to Analyze</Text>

          <Text style={styles.emptyDescription}>
            Click "Analyze My Instagram" to see who doesn't follow you back.
          </Text>
        </View>
      )}

      {/* RESULTS */}
      {analyzed && notBack.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Not Following You Back</Text>

          <Text style={styles.resultsSubtitle}>
            {filtered.length} account
            {filtered.length !== 1 ? "s" : ""} found
          </Text>

          {/* SEARCH */}
          <TextInput
            style={styles.search}
            placeholder="Search username..."
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />

          {/* USER RESULTS */}
          {filtered.length > 0 ? (
            filtered.map((user, index) => (
              <View key={`${user}-${index}`} style={styles.userCard}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View>
                  <Text style={styles.username}>@{user}</Text>

                  <Text style={styles.status}>Doesn't follow you back</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptySearch}>
              <Text style={styles.emptyText}>No username found</Text>
            </View>
          )}
        </View>
      )}

      {/* EVERYONE FOLLOWS BACK */}
      {analyzed && notBack.length === 0 && (
        <View style={styles.goodResult}>
          <Text style={styles.goodIcon}>🎉</Text>

          <Text style={styles.goodTitle}>Great News!</Text>

          <Text style={styles.goodDescription}>
            Everyone you follow is following you back.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },

  content: {
    padding: 20,
    paddingBottom: 50,
    width: "100%",
    maxWidth: 1000,
    alignSelf: "center",
  },

  header: {
    alignItems: "center",
    marginTop: 25,
    marginBottom: 30,
  },

  logo: {
    color: "#E1306C",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    color: "#8E8E93",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 600,
  },

  statsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },

  statsDesktop: {
    gap: 20,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },

  statNumber: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },

  statLabel: {
    color: "#8E8E93",
    fontSize: 11,
    textAlign: "center",
  },

  uploadSection: {
    gap: 15,
  },

  uploadDesktop: {
    flexDirection: "row",
  },

  uploadCard: {
    flex: 1,
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
  },

  uploadIcon: {
    fontSize: 32,
    marginBottom: 10,
  },

  uploadTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  uploadDescription: {
    color: "#8E8E93",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 18,
  },

  uploadButton: {
    backgroundColor: "#242424",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "100%",
  },

  uploadButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
  },

  success: {
    color: "#00D084",
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
  },

  pending: {
    color: "#666",
    fontSize: 12,
    marginTop: 12,
  },

  analyzeButton: {
    backgroundColor: "#E1306C",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 25,
  },

  analyzeButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  resetButton: {
    alignItems: "center",
    marginTop: 18,
  },

  resetText: {
    color: "#888",
    fontSize: 14,
  },

  resultsSection: {
    marginTop: 35,
  },

  resultsTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },

  resultsSubtitle: {
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 20,
  },

  search: {
    backgroundColor: "#1C1C1E",
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 15,
  },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#282828",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E1306C",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  username: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  status: {
    color: "#777",
    fontSize: 12,
    marginTop: 3,
  },

  emptyState: {
    alignItems: "center",
    marginTop: 50,
    padding: 30,
  },

  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  emptyDescription: {
    color: "#777",
    textAlign: "center",
    lineHeight: 20,
  },

  emptySearch: {
    padding: 30,
    alignItems: "center",
  },

  emptyText: {
    color: "#777",
  },

  goodResult: {
    alignItems: "center",
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 20,
    padding: 30,
    marginTop: 35,
  },

  goodIcon: {
    fontSize: 45,
    marginBottom: 12,
  },

  goodTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },

  goodDescription: {
    color: "#8E8E93",
    textAlign: "center",
    fontSize: 14,
  },
});
