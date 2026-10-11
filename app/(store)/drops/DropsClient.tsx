"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Flame,
  Play,
  Film,
} from "lucide-react";
import { Product } from "@/lib/products";
import { site } from "@/lib/site";
import styles from "./drops.module.css";

interface DropsClientProps {
  products: Product[];
}

interface OfficialReel {
  id: string;
  shortcode: string;
  url: string;
  embedUrl: string;
  views: string;
  title: string;
  tag: string;
  description: string;
  category: "reel";
}

interface OfficialPost {
  id: string;
  shortcode: string;
  url: string;
  embedUrl: string;
  title: string;
  tag: string;
  category: "post";
}

function InstagramIcon({ size = 16, className }: { size?: number | string; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// 4 Reels oficiales de @spm_store.cl con copywriting editorial profesional
const OFFICIAL_REELS: OfficialReel[] = [
  {
    id: "reel-1",
    shortcode: "Dd2jl-iRirX",
    url: "https://www.instagram.com/reel/Dd2jl-iRirX/",
    embedUrl: "https://www.instagram.com/reel/Dd2jl-iRirX/embed",
    views: "19.1K vistas",
    title: "Streetwear Santiago: Outfits & Caps",
    tag: "19.1K VISTAS",
    description: "Sesión editorial en exteriores combinando prendas urbanas y gorras de colección SPM.",
    category: "reel",
  },
  {
    id: "reel-2",
    shortcode: "DdukQuVxVoF",
    url: "https://www.instagram.com/reel/DdukQuVxVoF/",
    embedUrl: "https://www.instagram.com/reel/DdukQuVxVoF/embed",
    views: "15.4K vistas",
    title: "Inédit Edition: Bordados 3D Pesados",
    tag: "15.4K VISTAS",
    description: "Detalle macro en mano de silueta estructurada, textura pesada y bordado en alto relieve.",
    category: "reel",
  },
  {
    id: "reel-3",
    shortcode: "DdwtCQMuFDK",
    url: "https://www.instagram.com/reel/DdwtCQMuFDK/",
    embedUrl: "https://www.instagram.com/reel/DdwtCQMuFDK/embed",
    views: "3.4K vistas",
    title: "Black Crown: Relieve & Coronas Rígidas",
    tag: "3.4K VISTAS",
    description: "Corona alta estructurada en color negro con bordado 3D frontal y broche ajustable.",
    category: "reel",
  },
  {
    id: "reel-4",
    shortcode: "DdmS9j5RemV",
    url: "https://www.instagram.com/reel/DdmS9j5RemV/",
    embedUrl: "https://www.instagram.com/reel/DdmS9j5RemV/embed",
    views: "1.1K vistas",
    title: "Unboxing Oficial: Packaging Drop-Shop",
    tag: "1.1K VISTAS",
    description: "Recepción y revisión de cajas rígidas Drop-Shop con inventario exclusivo para Chile.",
    category: "reel",
  },
];

// 6 Publicaciones reales del feed de @spm_store.cl
const OFFICIAL_POSTS: OfficialPost[] = [
  {
    id: "post-1",
    shortcode: "DeNmskrkcCu",
    url: "https://www.instagram.com/p/DeNmskrkcCu/",
    embedUrl: "https://www.instagram.com/p/DeNmskrkcCu/embed",
    title: "Campaña Lookbook Oficial",
    tag: "EDITORIAL",
    category: "post",
  },
  {
    id: "post-2",
    shortcode: "DeNlT1VEQEw",
    url: "https://www.instagram.com/p/DeNlT1VEQEw/",
    embedUrl: "https://www.instagram.com/p/DeNlT1VEQEw/embed",
    title: "Colección Streetwear Headwear",
    tag: "LOOKBOOK",
    category: "post",
  },
  {
    id: "post-3",
    shortcode: "DeLOMAqxcw8",
    url: "https://www.instagram.com/p/DeLOMAqxcw8/",
    embedUrl: "https://www.instagram.com/p/DeLOMAqxcw8/embed",
    title: "Siluetas Estructuradas SPM",
    tag: "DETALLES",
    category: "post",
  },
  {
    id: "post-4",
    shortcode: "DeLNtMiRFyb",
    url: "https://www.instagram.com/p/DeLNtMiRFyb/",
    embedUrl: "https://www.instagram.com/p/DeLNtMiRFyb/embed",
    title: "Detalles & Visera Reforzada",
    tag: "CALIDAD 3D",
    category: "post",
  },
  {
    id: "post-5",
    shortcode: "DeLNehSEQxP",
    url: "https://www.instagram.com/p/DeLNehSEQxP/",
    embedUrl: "https://www.instagram.com/p/DeLNehSEQxP/embed",
    title: "Edición Urbana Limitada",
    tag: "DROP 2026",
    category: "post",
  },
  {
    id: "post-6",
    shortcode: "DeLMz2ixSYF",
    url: "https://www.instagram.com/p/DeLMz2ixSYF/",
    embedUrl: "https://www.instagram.com/p/DeLMz2ixSYF/embed",
    title: "Bordados 3D de Alta Densidad",
    tag: "ACABADOS",
    category: "post",
  },
];

export default function DropsClient({ products }: DropsClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "reels" | "posts">("all");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error - window.instgrm is loaded by Instagram embed script
      if (window.instgrm?.Embeds) {
        // @ts-expect-error - process embeds
        window.instgrm.Embeds.process();
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [activeTab]);

  return (
    <div className={styles.dropsPage}>
      {/* Hero Header - Limpio Blanco con Negro */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.badgeRow}>
              <span className={styles.heroBadge}>
                <Flame size={13} /> SPM® ARCHIVE · EDICIÓN 2026
              </span>
              <span className={styles.heroBadgeSecondary}>
                <Sparkles size={13} /> DROPS EXCLUSIVOS EN CHILE
              </span>
            </div>

            <h1 className={styles.heroTitle}>DROPS & ARCHIVO OFICIAL</h1>

            <p className={styles.heroSubtitle}>
              Lanzamientos exclusivos, sesiones de lookbook y registro en video de nuestras colecciones. Síguenos en Instagram <strong>@spm_store.cl</strong> para acceder a cada preventa antes del sold out.
            </p>

            {/* Tarjeta de Perfil Oficial SPM */}
            <div className={styles.igProfileCard}>
              <div className={styles.igProfileInfo}>
                <div className={styles.igAvatarRing}>
                  <div className={styles.igAvatar}>
                    <Image
                      src="/brand/spm-logo-black.png"
                      alt="SPM Store Instagram"
                      width={44}
                      height={44}
                      style={{ width: "100%", height: "auto" }}
                      className={styles.avatarImg}
                    />
                  </div>
                </div>
                <div>
                  <div className={styles.igUserTitle}>
                    <span className={styles.igUsername}>{site.instagramHandle}</span>
                    <span className={styles.verifiedBadge} title="Cuenta Oficial SPM">✓</span>
                  </div>
                  <p className={styles.igBioText}>
                    SPM BRANDS® · Streetwear • Accessories • More
                  </p>
                  <p className={styles.igMeta}>
                    218 Miembros · 104 Siguiendo · 25 Archivos Oficiales
                  </p>
                </div>
              </div>

              <div className={styles.igActionBtns}>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.igFollowBtn}
                >
                  <InstagramIcon size={16} />
                  <span>SEGUIR EN INSTAGRAM</span>
                  <ExternalLink size={13} />
                </a>
                <Link href="/tienda" className={styles.igShopBtn}>
                  <ShoppingBag size={15} />
                  <span>CATÁLOGO</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de Filtros / Pestañas */}
      <section className={styles.tabsSection}>
        <div className="container">
          <div className={styles.tabsContainer}>
            <div className={styles.tabsList}>
              <button
                onClick={() => setActiveTab("all")}
                className={`${styles.tabBtn} ${activeTab === "all" ? styles.activeTab : ""}`}
              >
                TODOS LOS ARCHIVOS (10)
              </button>
              <button
                onClick={() => setActiveTab("reels")}
                className={`${styles.tabBtn} ${activeTab === "reels" ? styles.activeTab : ""}`}
              >
                <Film size={14} /> REELS & VIDEOS (4)
              </button>
              <button
                onClick={() => setActiveTab("posts")}
                className={`${styles.tabBtn} ${activeTab === "posts" ? styles.activeTab : ""}`}
              >
                <InstagramIcon size={14} /> PUBLICACIONES DEL FEED (6)
              </button>
            </div>

            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.directIgBtn}
            >
              <span>Ver perfil en Instagram</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* SECCIÓN 1: REELS Y VIDEOS OFICIALES (4 Columnas Perfectamente Dimensionadas) */}
      {(activeTab === "all" || activeTab === "reels") && (
        <section className={styles.reelsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.subTag}>REDES SOCIALES SPM®</span>
                <h2 className={styles.sectionTitle}>SIGUE DE CERCA NUESTRO CONTENIDO</h2>
              </div>
              <p className={styles.sectionNotice}>
                Reels oficiales, producciones en estudio y adelantos exclusivos de cada drop. Conéctate con nuestra comunidad en redes.
              </p>
            </div>

            <div className={styles.reelsGrid}>
              {OFFICIAL_REELS.map((reel) => (
                <div key={reel.id} className={styles.reelEmbedCard}>
                  {/* Encabezado de la Tarjeta */}
                  <div className={styles.reelEmbedHeader}>
                    <span className={styles.reelBadge}>{reel.tag}</span>
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.openIgLink}
                      title="Abrir en Instagram"
                    >
                      <InstagramIcon size={14} />
                      <span>Ver en App</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>

                  {/* Iframe Embebido Proporcional */}
                  <div className={styles.iframeWrapper}>
                    <iframe
                      src={reel.embedUrl}
                      className={styles.instagramIframe}
                      frameBorder="0"
                      scrolling="no"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      title={reel.title}
                    />
                  </div>

                  {/* Información y Acciones */}
                  <div className={styles.reelCardFooter}>
                    <div className={styles.reelMetaText}>
                      <h3 className={styles.reelCardTitle}>{reel.title}</h3>
                      <p className={styles.reelCardDesc}>{reel.description}</p>
                    </div>
                    <div className={styles.reelCardActions}>
                      <a
                        href={reel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.reelWatchBtn}
                      >
                        <Play size={13} fill="currentColor" />
                        <span>VER EN INSTAGRAM</span>
                      </a>
                      <Link href="/tienda" className={styles.reelBuyBtn}>
                        <ShoppingBag size={13} />
                        <span>VER GORRAS</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN 2: PUBLICACIONES OFICIALES DEL FEED (3 Columnas Equilibradas) */}
      {(activeTab === "all" || activeTab === "posts") && (
        <section className={styles.postsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.subTag}>FEED & ARCHIVO VISUAL</span>
                <h2 className={styles.sectionTitle}>PUBLICACIONES & LOOKBOOK EN REDES</h2>
              </div>
              <p className={styles.sectionNotice}>
                Fotografías de campaña, planos detalle de bordados 3D y lanzamientos disponibles en tienda.
              </p>
            </div>

            <div className={styles.postsGrid}>
              {OFFICIAL_POSTS.map((post) => (
                <div key={post.id} className={styles.postEmbedCard}>
                  <div className={styles.postEmbedHeader}>
                    <span className={styles.postBadge}>{post.tag}</span>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.openIgLink}
                    >
                      <InstagramIcon size={14} />
                      <span>Abrir</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                  <div className={styles.postIframeWrapper}>
                    <iframe
                      src={post.embedUrl}
                      className={styles.instagramIframePost}
                      frameBorder="0"
                      scrolling="no"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      title={post.title}
                    />
                  </div>
                  <div className={styles.postCardFooter}>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.postLinkBtn}
                    >
                      <span>Ver publicación en Instagram @spm_store.cl</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Banner de Comunidad Oficial en Negro y Blanco */}
      <section className={styles.communityBanner}>
        <div className="container">
          <div className={styles.bannerBox}>
            <span className={styles.bannerTag}>COMUNIDAD @SPM_STORE.CL</span>
            <h2 className={styles.bannerTitle}>¿TIENES TU GORRA SPM?</h2>
            <p className={styles.bannerDesc}>
              Etiquétanos en tus fotos y reels usando <strong>@spm_store.cl</strong> y <strong>#SPMstreetwear</strong>. Compartimos los mejores contenidos en las historias oficiales y en nuestro archivo oficial de la marca.
            </p>
            <div className={styles.bannerActions}>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.bannerIgBtn}
              >
                <InstagramIcon size={16} />
                <span>IR A NUESTRO INSTAGRAM OFICIAL</span>
                <ExternalLink size={14} />
              </a>
              <Link href="/tienda" className={styles.bannerShopBtn}>
                <ShoppingBag size={15} />
                <span>EXPLORAR TIENDA</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
