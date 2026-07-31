import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '@/services/apiClient';
import { siteConfig as defaultSiteConfig, navItems as defaultNavItems } from '@/data/site';
import type { NavItem } from '@/types';

interface CmsContextType {
  siteSettings: Record<string, string>;
  navItems: NavItem[];
  socialLinks: Array<{ platform: string; url: string; iconName?: string }>;
  loading: boolean;
  refetchSettings: () => Promise<void>;
}

const CmsContext = createContext<CmsContextType>({
  siteSettings: {},
  navItems: defaultNavItems,
  socialLinks: [],
  loading: true,
  refetchSettings: async () => {},
});

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({
    name: defaultSiteConfig.name,
    tagline: defaultSiteConfig.tagline,
    email: defaultSiteConfig.email,
    phone: defaultSiteConfig.phone,
    instagram: defaultSiteConfig.instagram,
    facebook: defaultSiteConfig.facebook,
    description: defaultSiteConfig.description,
  });

  const [navItemsState, setNavItemsState] = useState<NavItem[]>(defaultNavItems);
  const [socialLinks, setSocialLinks] = useState<Array<{ platform: string; url: string }>>([
    { platform: 'Instagram', url: defaultSiteConfig.instagram },
    { platform: 'Facebook', url: defaultSiteConfig.facebook },
  ]);
  const [loading, setLoading] = useState(true);

  const fetchCmsData = async () => {
    try {
      setLoading(true);
      // Fire the three independent requests in parallel instead of awaiting them
      // one after another (previously a 3-request latency waterfall on every load).
      const [settings, navs, socials] = await Promise.all([
        apiFetch<Record<string, string>>('/public/settings').catch(() => null),
        apiFetch<Array<{ label: string; path: string; external?: boolean }>>('/public/navigation-menu').catch(() => null),
        apiFetch<Array<{ platform: string; url: string }>>('/public/social-links').catch(() => null),
      ]);

      if (settings && Object.keys(settings).length > 0) {
        setSiteSettings((prev) => ({ ...prev, ...settings }));
      }
      if (navs && navs.length > 0) {
        setNavItemsState(navs.map((n) => ({ label: n.label, to: n.path, external: n.external })));
      }
      if (socials && socials.length > 0) {
        setSocialLinks(socials);
      }
    } catch (e) {
      // Graceful fallback to static defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCmsData();
  }, []);

  return (
    <CmsContext.Provider
      value={{
        siteSettings,
        navItems: navItemsState,
        socialLinks,
        loading,
        refetchSettings: fetchCmsData,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => useContext(CmsContext);
