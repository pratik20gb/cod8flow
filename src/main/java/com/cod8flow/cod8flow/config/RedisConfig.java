package com.cod8flow.cod8flow.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import tools.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import tools.jackson.databind.jsontype.PolymorphicTypeValidator;

import java.time.Duration;

@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisCacheConfiguration redisCacheConfiguration() {

        PolymorphicTypeValidator typeValidator = BasicPolymorphicTypeValidator.builder()
                .allowIfBaseType(Object.class)
                .build();

        GenericJacksonJsonRedisSerializer serializer =
                GenericJacksonJsonRedisSerializer.builder()
                        .enableDefaultTyping(typeValidator)
                        .build();

        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer));
    }
}