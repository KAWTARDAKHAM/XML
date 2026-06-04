
export type Language = 'fr' | 'en';

export const translations = {
  fr: {
    nav: {
      home: "Accueil",
      analytics: "Analyses",
      calendar: "Calendrier",
      xmlTools: "Rapports",
      settings: "Configuration",
      logout: "Déconnexion"
    },
    settings: {
      title: "Configuration Système",
      subtitle: "Gérez vos préférences personnelles et vos protocoles d'alerte",
      sections: {
        profile: "Profil",
        display: "Affichage",
        notifications: "Notifications"
      },
      personalInfo: "Informations Personnelles",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email de contact",
      verifyEmail: "Vérifier l'email",
      emailVerified: "Email vérifié",
      emailPending: "Vérification en cours...",
      changePhoto: "Changer la photo",
      systemConfig: "Configuration Système",
      theme: "Thème d'Interface",
      themeDark: "Mode Sombre (Obsidian)",
      themeLight: "Mode Clair (Frost)",
      language: "Langue",
      alertProtocols: "Protocoles d'Alerte",
      deadlineAlerts: "Alertes de date limite",
      deadlineDesc: "Recevoir un email si une tâche non terminée approche de son échéance.",
      weeklySummary: "Résumé hebdomadaire",
      weeklyDesc: "Rapport d'activité consolidé chaque lundi matin.",
      save: "Enregistrer les modifications",
      saving: "Synchronisation..."
    },
    report: {
      title: "CENTRE DE RAPPORT",
      subtitle: "État du système : Synchronisé • Version 4.2",
      genDate: "Date de génération",
      nodeIdentity: "Identité du Node",
      timeline: "Timeline",
      priority: "Priorité",
      effort: "Effort",
      integrity: "Intégrité",
      summaryTitle: "Résumé de l'Architecture",
      summaryDesc: "Ce rapport résume {count} nodes actifs. L'intégrité globale est de {progress}%."
    }
  },
  en: {
    nav: {
      home: "Home",
      analytics: "Analytics",
      calendar: "Calendar",
      xmlTools: "Reports",
      settings: "Settings",
      logout: "Logout"
    },
    settings: {
      title: "System Configuration",
      subtitle: "Manage your personal preferences and alert protocols",
      sections: {
        profile: "Profile",
        display: "Display",
        notifications: "Notifications"
      },
      personalInfo: "Personal Information",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Contact Email",
      verifyEmail: "Verify Email",
      emailVerified: "Email Verified",
      emailPending: "Verification pending...",
      changePhoto: "Change Photo",
      systemConfig: "System Configuration",
      theme: "Interface Theme",
      themeDark: "Dark Mode (Obsidian)",
      themeLight: "Light Mode (Frost)",
      language: "Language",
      alertProtocols: "Alert Protocols",
      deadlineAlerts: "Deadline Alerts",
      deadlineDesc: "Receive an email if an unfinished task approaches its deadline.",
      weeklySummary: "Weekly Summary",
      weeklyDesc: "Consolidated activity report every Monday morning.",
      save: "Save Changes",
      saving: "Synchronizing..."
    },
    report: {
      title: "REPORT CENTER",
      subtitle: "System Status: Synchronized • Version 4.2",
      genDate: "Generation Date",
      nodeIdentity: "Node Identity",
      timeline: "Timeline",
      priority: "Priority",
      effort: "Effort",
      integrity: "Integrity",
      summaryTitle: "Architecture Summary",
      summaryDesc: "This report summarizes {count} active nodes. Overall integrity is {progress}%."
    }
  }
};
