import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../components/ui/AppHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionHeader } from '../components/ui/SectionHeader';
import { colors, spacing, typography } from '../theme';
import { JournalEntry } from '../types/journal';
import { clearJournalEntries, getJournalEntries, saveJournalEntry } from '../services/storage/journalStorage';

export function JournalScreen() {
  const [visible, setVisible] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState('');
  const [reflection, setReflection] = useState('');
  const [mood, setMood] = useState('Calm');

  useEffect(() => {
    const loadEntries = async () => {
      const storedEntries = await getJournalEntries();
      setEntries(storedEntries);
    };

    loadEntries();
  }, []);

  const handleSave = async () => {
    if (!title.trim() || !reflection.trim()) return;

    const entry: JournalEntry = {
      id: `${Date.now()}`,
      title: title.trim(),
      reflection: reflection.trim(),
      mood,
      createdAt: new Date().toISOString(),
    };

    await saveJournalEntry(entry);
    setEntries((current) => [entry, ...current]);
    setTitle('');
    setReflection('');
    setMood('Calm');
    setVisible(false);
  };

  const handleClear = async () => {
    await clearJournalEntries();
    setEntries([]);
  };

  return (
    <ScreenContainer style={styles.screen}>
      <AppHeader title="Memory Journal" subtitle="Capture the quiet moments that matter." />
      <SectionHeader title="Entries" hint="Keep a living record of your reflections." />
      <Card style={styles.card}>
        <Text style={styles.title}>Your memories will appear here.</Text>
        <Text style={styles.body}>Start adding reflections, photos, voice notes, and daily moods.</Text>
        <View style={styles.actions}>
          <Button title="New Memory" onPress={() => setVisible(true)} />
          {entries.length > 0 ? <Button title="Clear" variant="secondary" onPress={handleClear} /> : null}
        </View>
      </Card>

      {entries.length === 0 ? (
        <View style={styles.state}>
          <EmptyState title="No entries yet" hint="This space will grow into a personal archive." />
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {entries.map((entry) => (
            <Card key={entry.id} style={styles.entryCard}>
              <Text style={styles.entryTitle}>{entry.title}</Text>
              <Text style={styles.entryMood}>{entry.mood}</Text>
              <Text style={styles.entryReflection}>{entry.reflection}</Text>
              <Text style={styles.entryDate}>{new Date(entry.createdAt).toLocaleDateString()}</Text>
            </Card>
          ))}
        </ScrollView>
      )}

      <Modal visible={visible} title="New memory" onClose={() => setVisible(false)}>
        <Input label="Title" placeholder="What happened today?" value={title} onChangeText={setTitle} />
        <Input label="Reflection" placeholder="Write a few gentle lines..." value={reflection} onChangeText={setReflection} />
        <Input label="Mood" placeholder="Calm" value={mood} onChangeText={setMood} />
        <Button title="Save memory" onPress={handleSave} />
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 0 },
  card: { marginTop: spacing.md },
  title: { color: colors.textPrimary, fontSize: typography.subtitle, fontWeight: '600', marginBottom: 6 },
  body: { color: colors.textSecondary, fontSize: typography.body, lineHeight: 20 },
  actions: { marginTop: spacing.md, flexDirection: 'row', gap: 10 },
  state: { marginTop: spacing.md },
  list: { marginTop: spacing.md },
  listContent: { paddingBottom: spacing.xl },
  entryCard: { marginBottom: spacing.sm },
  entryTitle: { color: colors.textPrimary, fontSize: typography.subtitle, fontWeight: '600', marginBottom: 4 },
  entryMood: { color: colors.accent, fontSize: typography.caption, marginBottom: 8 },
  entryReflection: { color: colors.textSecondary, fontSize: typography.body, lineHeight: 20 },
  entryDate: { color: colors.textSecondary, fontSize: typography.caption, marginTop: 8 },
});
