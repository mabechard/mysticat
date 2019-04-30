package com.multitiers.domaine.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;

import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Table;

@Entity
@Table(name = "mys_user_usr")
public class User {
	@Column(name = "usr_id", nullable = false, updatable = false)
	@Id
	protected String id;

	@Column(name = "usr_username", unique = true)
	protected String username;

	@Column(name = "usr_password")
	protected String passwordHash;

	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "id_user")
	@OrderColumn
	protected List<Deck> decks;

	@Column(name = "usr_salt", nullable = false, updatable = false)
	protected String hashedSalt;

	@Column(name = "usr_hero_img_path")
	protected HeroPortrait heroPortrait;
	
	@Column(name="usr_favorite_deck")
	protected Integer favoriteDeck;

	public User(String username, String passwordHash, String hashedSalt) {
		super();
		this.username = username;
		this.hashedSalt = hashedSalt;
		this.passwordHash = passwordHash;
		this.decks = new ArrayList<>();
		this.favoriteDeck = 0;
	}

	public User() {
	}

	public String getHashedSalt() {
		return hashedSalt;
	}

	public void setHashedSalt(String hashedSalt) {
		this.hashedSalt = hashedSalt;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	public List<Deck> getDecks() {
		return decks;
	}

	public void setDecks(List<Deck> decks) {
		this.decks = decks;
	}

	public HeroPortrait getHeroPortrait() {
		return heroPortrait;
	}

	public void setHeroPortrait(HeroPortrait heroPortrait) {
		this.heroPortrait = heroPortrait;
	}

	public Integer getFavoriteDeck() {
		return favoriteDeck;
	}

	public void setFavoriteDeck(Integer favoriteDeck) {
		this.favoriteDeck = favoriteDeck;
	}
}