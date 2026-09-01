import * as Font from 'expo-font';

export const fontAssets = {};

export async function loadFonts() {
  return Font.loadAsync(fontAssets);
}