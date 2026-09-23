package com.gov.script_site.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.gov.script_site.entity.Script;
import com.gov.script_site.entity.Tag;
import com.gov.script_site.entity.Tag.TagType;
import com.gov.script_site.entity.User;
import com.gov.script_site.repository.UserRepository;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        List<Tag> tags = List.of(new Tag("Animation", TagType.VO_GENRE), new Tag("Narration", TagType.VO_GENRE),
                new Tag("Video Game", TagType.VO_GENRE),
                new Tag("Comercial", TagType.VO_GENRE),
                new Tag("Radio", TagType.VO_GENRE), new Tag("Action", TagType.ACTING_GENRE),
                new Tag("Monologue", TagType.SCRIPT_TYPE));

        User user = new User("user", "test@local.com", passwordEncoder.encode("Welcome1"));

        Script sampleScript = new Script(user, "Sample Script", "This is a simple sample script");
        tags.forEach(t -> sampleScript.addTag(t));

        user.addScript(sampleScript);
        user = userRepository.save(user);
    }

}
