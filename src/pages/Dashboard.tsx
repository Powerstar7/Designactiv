@@ .. @@
 import { tools } from '../data/tools';
 import { useLanguage } from '../context/LanguageContext';
 import { useLocalizedTools } from '../data/tools';
+import { SubscriptionStatus } from '../components/SubscriptionStatus';
 
 export function Dashboard() {
@@ .. @@
   return (
     <div className="min-h-screen bg-gray-50 py-8">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
+        <div className="mb-8">
+          <SubscriptionStatus />
+        </div>
+        
         <div className="mb-8">
@@ .. @@